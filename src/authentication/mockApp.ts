import * as Koa from 'koa'
import * as fetch from 'isomorphic-fetch'
import { sign, sha256 } from '../common'
import { doubleSha, signMessage } from './helpers'

const bitcore = require('bitcore-lib')
const uuid = require('uuid')
const Body = require('koa-body')
const Route = require('koa-route')
const IO = require('koa-socket')

const key = bitcore.PrivateKey(sha256(process.argv[2]).toString('hex'))
console.log(key)

interface AuthServerOptons {
  port: number
}

const server = '192.168.0.168:5000'

export default async function createServer(options: AuthServerOptons) {

  const koa = new Koa() as any
  koa.use(Body())

  koa.use(Route.post('/:id', async (ctx: any, id: string) => {

    try {
      const request = await fetch(`http://${server}/request/${id}`)
      const body = await request.json() as any
      const signFunc = signMessage.bind(null, body.bitcoin)

      const result = body.multiple
        ? body.message.map((message: string) => signFunc(message, key))
        : signFunc(body.message, key)
      const endpoint = body.multiple ? 'multiple': 'request'

      await fetch(`http://${server}/${endpoint}/${id}`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(result)
      }).then(async(res) => {
        const text = await res.text()
        console.log(text)
        ctx.response.body = text
      })
    } catch (error) {
      console.log(error, error.stack)
    }

  }))

  koa.use(async (ctx: any, next: Function) => {
    try {
      await next()
    } catch (error) {
      console.log(`Error processing ${ctx.method} ${ctx.path}`, error, error.stack)
    }
  })

  return koa
}

export async function start(options?: AuthServerOptons) {
  options = Object.assign({}, {
    port: parseInt(process.argv[2], 10)
  }, options || {})
  const server = await createServer(options)
  await server.listen(options.port, '0.0.0.0')

  console.log('Server started successfully.')
}

start().catch(error => console.log(error))

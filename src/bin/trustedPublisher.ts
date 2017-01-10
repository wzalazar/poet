import * as Koa from 'koa'

const Body = require('koa-body')
const Route = require('koa-route')

import { Claim, PoetBlock } from "../model/claim"
import { default as getCreator, ClaimBuilder } from "../model/builder"

export interface TrustedPublisherOptions {
  port: number
  broadcast: boolean
}

export default async function createServer(options?: TrustedPublisherOptions) {
  const koa = new Koa()
  const creator = await getCreator();

  koa.use(Body())

  koa.use(Route.post('/claim', async (ctx: any) => {
    const claimData: Claim = ctx.request.body as Claim
    console.log('Claim data is', claimData)
    const block: PoetBlock = creator.createBlock([claimData])
    console.log('Poet block hash is', block.id)

    try {
      const tx = await creator.createTransaction(block.id)
      console.log('Bitcoin transaction hash is', tx.hash)

      if (!options.broadcast) {
        return
      }

      ctx.body = await ClaimBuilder.broadcastTx(tx)
    } catch (error) {
      ctx.body = JSON.stringify({ error })
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

export async function start(options?: TrustedPublisherOptions) {
  options = Object.assign({}, {
    port: 3000,
    broadcast: true
  }, options || {})
  const server = await createServer(options)
  await server.listen(options.port)

  console.log('Server started successfully.')
}

if (!module.parent) {
  start().catch(error => {
    console.log('Unable to start Trusted Publisher server:', error, error.stack)
  })
}

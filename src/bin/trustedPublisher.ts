import * as Koa from 'koa'

const Body = require('koa-body')
const Route = require('koa-route')

import { Claim, Block } from "../claim"
import { default as getCreator, ClaimBuilder } from "../serialization/builder"
import { getHash } from '../helpers/torrentHash'
import { Queue } from '../queue'


export interface TrustedPublisherOptions {
  port: number
  broadcast: boolean
}

const createClaim = (creator: ClaimBuilder, claimInfo: any, privateKey: string): Claim => {
  return creator.createSignedClaim(claimInfo, privateKey)
}

export default async function createServer(options?: TrustedPublisherOptions) {
  const koa = new Koa()
  const creator = await getCreator()
  const queue = new Queue()

  koa.use(Body())

  koa.use(Route.post('/claimHelper', async (ctx: any) => {
    const claimData: any[] = ctx.request.body.claims
    const claims: Claim[] = []
    for (let claimInfo of claimData){
      claims.push(createClaim(creator, claimInfo, ctx.request.body.privateKey))
    }
    console.log('Claim data is', claimData)
    const block: Block = creator.createBlock(claims)
    console.log('Poet block hash is', block.id)
  }))

  koa.use(Route.post('/claim', async (ctx: any) => {
    const claimData: Claim = ctx.request.body as Claim
    console.log('Claim data is', claimData)
    const block: Block = creator.createBlock([claimData])
    console.log('Poet block hash is', block.id)

    try {
      await queue.announceBlockToSend(block)
    } catch (error) {
      console.log('Could not publish block', error, error.stack)
    }

    try {
      const id = await getHash(creator.serializeBlockForSave(block), block.id)
      const tx = await creator.createTransaction(id)
      console.log('Bitcoin transaction hash is', tx.hash)
      console.log('Torrent hash is', id)

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

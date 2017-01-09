import * as Koa from 'koa'
import * as Route from 'koa-route'
import * as Body from 'koa-body'

import { Claim, PoetBlock } from "../model/claim"
import { ClaimCreator } from "../systems/creator"

export interface TrustedPublisherOptions {}

export default async function createServer(options?: TrustedPublisherOptions) {
  const koa = new Koa()
  const creator = new ClaimCreator();

  koa.use(Body())

  koa.use(Route.post('/claim', async ctx => {
    const claimData: Claim = ctx.body.claim as Claim
    const block: PoetBlock = creator.createBlock([claimData])

    try {
      const tx = await creator.createTransaction(block.id)
      const broadcasted = await creator.broadcastTx(tx)
      ctx.body = broadcasted
    } catch (error) {
      ctx.body = JSON.stringify({ error })
    }
  }))

  koa.use(async (ctx, next) => {
    try {
      await next()
    } catch (error) {
      console.log(`Error processing ${ctx.method} ${ctx.path}`, error, error.stack)
    }
  })

  return koa
}

export async function start(options?: TrustedPublisherOptions) {
  const server = await createServer(options)
  await server.listen()
}

if (!module.parent) {
  start().catch(error => {
    console.log('Unable to start Trusted Publisher server:', error, error.stack)
  })
}

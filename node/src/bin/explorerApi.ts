import * as Koa from 'koa'
import * as Router from 'koa-router'
import BlockchainService from '../blockchain/domainService'
import BlockchainRouter from '../blockchain/httpApi/router'

const Body = require('koa-body')

export interface ExplorerOptions {
  port: number
}

export default async function createServer(options?: ExplorerOptions) {
  const koa = new Koa()
  const service = new BlockchainService()
  const routeStrategy = new BlockchainRouter(service)

  const router = new Router()
  await routeStrategy.addRoutes(router)

  koa.use(Body())
  koa.use(router.allowedMethods())
  koa.use(router.routes())
  koa.use(async (ctx: any, next: Function) => {
    try {
      await next()
    } catch (error) {
      console.log(`Error processing ${ctx.method} ${ctx.path}`, error, error.stack)
    }
  })

  return koa
}

export async function start(options?: ExplorerOptions) {
  options = Object.assign({}, {
    port: 4000,
  }, options || {})
  const server = await createServer(options)
  await server.listen(options.port, '0.0.0.0')

  console.log('Server started successfully.')
}

if (!module.parent) {
  start().catch(error => {
    console.log('Unable to start Trusted Publisher server:', error, error.stack)
  })
}

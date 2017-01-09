import { default as DownloadSystem } from './db'

const Router = require('koa-router')

export default class Api {
  api

  constructor(downloadSystem, app) {

    this.api = Router()

    this.setupRoutes(downloadSystem)

    this.bindToApp(app)
  }

  bindToApp(app) {
    app.use(this.api.routes())
    app.use(this.api.allowedMethods())
  }

  setupRoutes(ds: DownloadSystem) {
    this.api
    .get('/claim/:id', async (ctx, next) => {
      const claim = await ds.getClaim(ctx.params.id)
      if (!claim) {
        ctx.status = 404
        return
      }
      ctx.body = JSON.stringify(claim)
    })
    .get('/titleFor/:id', async (ctx, next) => {
      const claim = await ds.getTitleFor(ctx.params.id)
      if (!claim) {
        ctx.status = 404
        return
      }
      ctx.body = JSON.stringify(claim)
    })
    .get('/profileByPublicKey/:id', async (ctx, next) => {
      const claim = await ds.getProfileForPublicKey(ctx.params.id)
      if (!claim) {
        ctx.status = 404
        return
      }
      ctx.body = JSON.stringify(claim)
      await next()
    })
    .get('/issuerFor/:id', async (ctx, next) => {
      const claim = await ds.getClaim(ctx.params.id)
      if (!claim) {
        ctx.status = 404
        return
      }
      const profile = await ds.getProfileForPublicKey(claim.publicKey)
      ctx.body = JSON.stringify(profile)
    })
    .get('/ownerFor/:id', async (ctx, next) => {
      const titleClaim = await ds.getTitleFor(ctx.params.id)
      if (!titleClaim) {
        ctx.status = 404
        return
      }
      console.log(titleClaim)
      const profileClaim = await ds.getProfileForPublicKey(titleClaim.publicKey)
      
      if (!profileClaim) {
        ctx.status = 404
        return
      }
      ctx.body = JSON.stringify(profileClaim)
    })
    .get('/block/:id', async (ctx, next) => {
      const block = await ds.getBlock(ctx.params.id)
      if (!block) {
        ctx.status = 404
        return
      }
      ctx.body = JSON.stringify(block)
    })
    .get('/all_blocks', async (ctx, next) => {
      const allBlocks = await ds.getAllBlocks()
      ctx.body = JSON.stringify(allBlocks)
      next()
    })
    .get('/all_claims', async (ctx, next) => {
      ctx.body = JSON.stringify(await ds.getAllClaims())
    })
  }
}

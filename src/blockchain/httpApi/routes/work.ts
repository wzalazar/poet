import 'reflect-metadata'
import * as Koa from 'koa'
import BlockchainService from '../../service'
import Route, { QueryOptions } from '../route'
import Work from '../../orm/derived/work'
import OfferingRoute from './offerings'
import Router = require('koa-router')
import Context = Koa.Context

export default class WorkRoute extends Route<Work> {
  service: BlockchainService
  offerings: OfferingRoute

  constructor(service: BlockchainService) {
    super(service.workRepository, 'works')
    this.service = service

    this.offerings = new OfferingRoute(service)
  }

  async getItem(id: string) {
    const work = await this.service.getWorkFull(id)
    const claim = await this.service.getClaim(id)
    return { ...claim, ...work }
  }

  async getCollection(opts: QueryOptions) {
    const items = await super.getCollection(opts)
    return await Promise.all(items.map(
      async (item) => {
        const work = this.service.getWorkFull(item.id)
        const info = this.service.getClaimInfo(item.id)
        return { claimInfo: info, ...work }
      }
    ))
  }

  addRoutes(router: Router): any {
    super.addRoutes(router)

    router.get('/works/:workId/offerings', async (ctx: any) => {
      const offerings = await this.service.offeringRepository.find({ work: ctx.params.workId })
      ctx.body = this.offerings.renderCollection(offerings)
    })
  }
}

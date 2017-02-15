import 'reflect-metadata'
import * as Koa from 'koa'
import BlockchainService from '../../domainService'
import Route, { QueryOptions } from '../route'
import Work from '../../orm/domain/work'
import OfferingRoute from './offerings'
import Router = require('koa-router')
import Context = Koa.Context
import { QueryBuilder } from 'typeorm';

interface WorkQueryOpts extends QueryOptions {
  owner?: string
  author?: string
  licensedTo?: string

  relatedTo?: string

  articleType?: string

  startCreationDate?: number
  endCreationDate?: number
}

const OWNER = 'owner'
const AUTHOR = 'author'
const RELATED_TO = 'related_to'
const LICENSED_TO = 'licensed_to'

const ARTICLE_TYPE = 'type'

const START_CREATION_DATE = 'from'
const END_CREATION_DATE = 'until'

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
    const info = await this.service.getClaimInfo(id)
    return { claimInfo: info, ...claim, ...work }
  }

  async getCollection(opts: QueryOptions) {
    const items = await super.getCollection(opts)
    return await Promise.all(items.map(
      async (item) => {
        const work = await this.service.getWorkFull(item.id)
        const info = await this.service.getClaimInfo(item.id)
        return { claimInfo: info, ...work }
      }
    ))
  }

  ownFilter(queryBuilder: QueryBuilder<Work>, opts: WorkQueryOpts): QueryBuilder<Work> {
    if (opts.articleType) {
      queryBuilder.andWhere('git c')
    }
    return queryBuilder
  }

  getParamOpts(ctx: Context): WorkQueryOpts {
    const result = super.getParamOpts(ctx)
    return Object.assign(result, {
      owner: ctx.params[OWNER],
      author: ctx.params[AUTHOR],
      licensedTo: ctx.params[LICENSED_TO],
      relatedTo: ctx.params[RELATED_TO],
      articleType: ctx.params[ARTICLE_TYPE],
      startCreationDate: ctx.params[START_CREATION_DATE],
      endCreationDate: ctx.params[END_CREATION_DATE],
    }) as WorkQueryOpts
  }

  addRoutes(router: Router): any {
    super.addRoutes(router)

    router.get('/works/:workId/offerings', async (ctx: any) => {
      const offerings = await this.service.offeringRepository.find({ work: ctx.params.workId })
      ctx.body = this.offerings.renderCollection(offerings)
    })
  }
}

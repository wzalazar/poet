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

  attribute?: string

  relatedTo?: string

  articleType?: string

  query?: string

  startCreationDate?: number
  endCreationDate?: number
}

const QUERY = 'query'
const OWNER = 'owner'
const AUTHOR = 'author'
const RELATED_TO = 'related_to'
const LICENSED_TO = 'licensed_to'

const ATTRIBUTE = 'attribute'
const ARTICLE_TYPE = 'type'

const START_CREATION_DATE = 'dateFrom'
const END_CREATION_DATE = 'dateUntil'

const ONLY_LETTERS = '^[a-zA-Z]+$'

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
    const countAttrs = (opts.attribute ? 1 : 0) + (opts.query ? 1 : 0) + (opts.startCreationDate ? 1 : 0) + (opts.endCreationDate ? 1 : 0)
    let iterAttrs = 0
    for (let i = 0; i < countAttrs; i++) {
      queryBuilder.leftJoin('attribute', 'attr' + i, `attr${i}.claim=item.id`)
    }
    if (opts.licensedTo || opts.relatedTo) {
      queryBuilder.leftJoin('item.publishers', 'item.publishers', 'publishers')
    }
    if (opts.owner) {
      queryBuilder.andWhere('item.owner=:owner', { owner: opts.owner })
    }
    if (opts.attribute) {
      const [key, value] = opts.attribute.split('<>')
      console.log('received', key, value)
      if (new RegExp(ONLY_LETTERS, 'gi').test(key)) {
        queryBuilder.andWhere(`attr${iterAttrs}.key=:key AND attr${iterAttrs}.value=:value`, {key, value})
        iterAttrs++
      }
    }
    if (opts.query) {
      queryBuilder.andWhere(`(attr${iterAttrs}.key=:content AND attr${iterAttrs}.value LIKE :value)
        OR (attr${iterAttrs}.key=:title AND attr${iterAttrs}.value LIKE :value)`,
      {
        content: 'content', value: '%' + opts.query + '%', title: 'name'
      })
      iterAttrs++
    }
    if (opts.startCreationDate) {
      queryBuilder.andWhere(`(attr${iterAttrs}.key=:startDate AND attr${iterAttrs}.value >= :value)`,
        {
          startDate: 'createdAt', value: opts.startCreationDate
        })
      iterAttrs++
    }
    if (opts.endCreationDate) {
      queryBuilder.andWhere(`(attr${iterAttrs}.key=:endDate AND attr${iterAttrs}.value <= :value)`,
        {
          endDate: 'createdAt', value: opts.endCreationDate
        })
      iterAttrs++
    }
    if (opts.author) {
      queryBuilder.andWhere('item.author=:author', { author: opts.author })
    }
    if (opts.licensedTo) {
      queryBuilder.andWhere('publishers.id=:licensedTo', { licensedTo: opts.licensedTo })
    }
    if (opts.relatedTo) {
      queryBuilder.andWhere(`(publishers.id=:licensedTo)
                          OR (item.owner   =:owner)
                          OR (item.author  =:author)`, {
      licensedTo: opts.licensedTo,
      owner     : opts.owner,
      author    : opts.author })
    }
    // Temporary fix: Sort by id, descending.
    // Should be: JOIN with claimInfo, sort by BlockHeight:ClaimOrder,
    //            or id if this doesn't exist
    queryBuilder.leftJoin('claim_info', 'claim_info', 'claim_info.hash=item.id')
    queryBuilder.orderBy('claim_info.id', 'DESC')
    return queryBuilder
  }

  getParamOpts(ctx: Context): WorkQueryOpts {
    const result = super.getParamOpts(ctx)
    return Object.assign(result, {
      owner: ctx.request.query[OWNER],
      query: ctx.request.query[QUERY],
      author: ctx.request.query[AUTHOR],
      licensedTo: ctx.request.query[LICENSED_TO],
      relatedTo: ctx.request.query[RELATED_TO],
      attribute: ctx.request.query[ATTRIBUTE],
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

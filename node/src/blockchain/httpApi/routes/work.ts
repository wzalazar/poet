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

  startPublicationDate?: number
  endPublicationDate?: number
}

const QUERY = 'query'
const OWNER = 'owner'
const AUTHOR = 'author'
const RELATED_TO = 'related_to'
const LICENSED_TO = 'licensed_to'

const ATTRIBUTE = 'attribute'
const ARTICLE_TYPE = 'type'

const START_PUBLICATION_DATE = 'dateFrom'
const END_PUBLICATION_DATE = 'dateTo'

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
    const countAttrs = (opts.attribute ? 1 : 0)
      + (opts.query ? 1 : 0)
      + (opts.startPublicationDate ? 1 : 0)
      + (opts.endPublicationDate ? 1 : 0)
    console.log('Ownfilter', opts, countAttrs)
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
      const [key1, value1] = opts.attribute.split('<>')
      if (new RegExp(ONLY_LETTERS, 'gi').test(key1)) {
        queryBuilder.andWhere(
          `attr${iterAttrs}.key=:key1 AND attr${iterAttrs}.value=:value1`,
          { key1, value1 }
        )
        iterAttrs++
      }
    }
    if (opts.query) {
      queryBuilder.andWhere(`(attr${iterAttrs}.key=:content OR attr${iterAttrs}.key=:title) AND lower(attr${iterAttrs}.value) LIKE :value2`,
      {
        content: 'content', value2: '%' + opts.query.toLowerCase() + '%', title: 'name'
      })
      iterAttrs++
    }
    if (opts.startPublicationDate) {
      queryBuilder.andWhere(`(attr${iterAttrs}.key=:startDate AND attr${iterAttrs}.value >= :value3)`,
        {
          startDate: 'publicationDate', value3: opts.startPublicationDate
        })
      iterAttrs++
    }
    if (opts.endPublicationDate) {
      queryBuilder.andWhere(`(attr${iterAttrs}.key=:endDate AND attr${iterAttrs}.value <= :value4)`,
        {
          endDate: 'publicationDate', value4: opts.endPublicationDate
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
      licensedTo: opts.relatedTo,
      owner     : opts.relatedTo,
      author    : opts.relatedTo })
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
      startPublicationDate: ctx.request.query[START_PUBLICATION_DATE],
      endPublicationDate: ctx.request.query[END_PUBLICATION_DATE],
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

import 'reflect-metadata'
import * as Koa from 'koa'

import BlockchainService from '../../domainService'
import Route, { QueryOptions } from '../route'
import License from '../../orm/domain/license'
import Router = require('koa-router')
import Context = Koa.Context
import { QueryBuilder } from 'typeorm'

interface LicenseQueryOptions extends QueryOptions {
  emitter?: string
  holder?: string
  relatedTo?: string
}

export default class LicenseRoute extends Route<License> {
  service: BlockchainService

  constructor(service: BlockchainService) {
    super(service.licenseRepository, 'licenses')
    this.service = service
  }

  async getItem(id: string) {
    const info = await this.service.getClaimInfo(id)
    const license = await this.service.getLicenseFull(id)
    return { claimInfo: info, ...license }
  }

  async getCollection(opts: QueryOptions) {
    const items = await super.getCollection(opts)
    return await Promise.all(items.map(
      async (item) => {
        const license = await this.service.getLicenseFull(item.id)
        const info = await this.service.getClaimInfo(item.id)
        return { claimInfo: info, ...license }
      }
    ))
  }

  getParamOpts(ctx: Context): LicenseQueryOptions {
    const options = super.getParamOpts(ctx) as LicenseQueryOptions;
    options.emitter = ctx.request.query['emitter']
    options.holder = ctx.request.query['holder']
    options.relatedTo = ctx.request.query['relatedTo']
    return options
  }

  ownFilter(queryBuilder: QueryBuilder<License>, opts: LicenseQueryOptions): QueryBuilder<License> {
    if (opts.holder) {
      return queryBuilder
        .andWhere("item.licenseHolder=:holder", { "holder": opts.holder })
    }
    if (opts.emitter) {
      return queryBuilder
        .andWhere("item.licenseEmitter=:emitter", { "emitter": opts.emitter })
    }
    if (opts.relatedTo) {
      return queryBuilder
        .andWhere("item.licenseEmitter=:user OR item.licenseHolder=:user", { "user": opts.relatedTo })
    }
    return queryBuilder
  }
}
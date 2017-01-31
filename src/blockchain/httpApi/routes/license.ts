import 'reflect-metadata'
import * as Koa from 'koa'

import BlockchainService from '../../service'
import Route, { QueryOptions } from '../route'
import License from '../../orm/derived/license'
import Router = require('koa-router')
import Context = Koa.Context
import { QueryBuilder } from 'typeorm'

interface LicenseQueryOptions extends QueryOptions {
  holder?: string
}

export default class LicenseRoute extends Route<License> {
  service: BlockchainService

  constructor(service: BlockchainService) {
    super(service.licenseRepository, 'licenses')
    this.service = service
  }

  async getItem(id: string) {
    return await this.service.getLicenseFull(id)
  }

  async getCollection(opts: QueryOptions) {
    const items = await super.getCollection(opts)
    return await Promise.all(items.map(
      item => this.service.getLicenseFull(item.id)
    ))

  }

  ownFilter(queryBuilder: QueryBuilder<License>, opts: LicenseQueryOptions): QueryBuilder<License> {
    if (opts.holder) {
      return queryBuilder
        .andWhere("licenseHolder=:holder", { "holder": opts.holder })
    }
    return queryBuilder
  }
}
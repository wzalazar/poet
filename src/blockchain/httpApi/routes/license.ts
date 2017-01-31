import 'reflect-metadata'
import * as Koa from 'koa'

import BlockchainService from '../../service'
import Route, { QueryOptions } from '../route'
import Work from '../../orm/derived/work'
import OfferingRoute from './offerings'
import Router = require('koa-router')
import Profile from "../../orm/derived/profile";
import Context = Koa.Context
import License from '../../orm/derived/license'

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
}
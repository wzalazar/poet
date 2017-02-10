import 'reflect-metadata'
import * as Koa from 'koa'

import BlockchainService from '../../domainService'
import Route, { QueryOptions } from '../route'
import Work from '../../orm/domain/work'
import OfferingRoute from './offerings'
import Router = require('koa-router')
import Profile from "../../orm/domain/profile";
import Context = Koa.Context

export default class ProfileRoute extends Route<Profile> {
  service: BlockchainService

  constructor(service: BlockchainService) {
    super(service.profileRepository, 'profiles')
    this.service = service
  }

  async getItem(id: string) {
    return await this.service.getProfileFull(id)
  }

  async getCollection(opts: QueryOptions) {
    const items = await super.getCollection(opts)
    return await Promise.all(items.map(
      item => this.service.getProfileFull(item.id)
    ))

  }
}
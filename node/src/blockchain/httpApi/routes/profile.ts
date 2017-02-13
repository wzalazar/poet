import 'reflect-metadata';
import * as Koa from 'koa';
import BlockchainService from '../../domainService';
import Route, { QueryOptions } from '../route';
import Profile from '../../orm/domain/profile';
import Router = require('koa-router')
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

  addRoutes(router: Router): any {
    super.addRoutes(router);

    router.get(`/ownerOf/:id`, async (ctx) => {
      try {
        var workId = ctx.params['id'];
        console.log(workId)
        const profileId = await this.service.getOwnerPublicKey(workId)
        const profile = await this.service.getProfileFull(profileId)
        console.log(profileId)
        ctx.body = await this.renderItem(profile)
      } catch (e) {
        console.log(e, e.stack)
      }
    })
  }
}
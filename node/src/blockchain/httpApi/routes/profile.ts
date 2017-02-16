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

  async prepareItem(profile: Profile) {
    return await this.service.getProfileFull(profile.id)
  }

  addRoutes(router: Router): any {
    super.addRoutes(router);

    router.get(`/profiles/ownerOf/:id`, async (ctx) => {
      try {
        const workId = ctx.params['id']
        const profileId = await this.service.getOwnerPublicKey(workId)
        const profile = await this.service.getProfileFull(profileId)
        ctx.body = await this.renderItem(profile)
      } catch (e) {
        console.log(e, e.stack)
      }
    })

    router.get(`/profiles/autocomplete/:name`, async (ctx) => {
      try {
        const name = ctx.params['name']
        const suggestions = await this.service.findSimilarProfiles(name)
        ctx.body = await this.renderCollection(suggestions)
      } catch (e) {
        console.log(e, e.stack)
      }
    })
  }
}
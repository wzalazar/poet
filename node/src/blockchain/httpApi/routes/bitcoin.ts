import 'reflect-metadata'

import * as Koa from 'koa'
import Router = require('koa-router')
import Context = Koa.Context

import BlockchainService from '../../domainService'
import Route from '../route'
import Normalized from '../../orm/bitcoin/normalized'

export default class BitcoinMalleabilityRoute extends Route<Normalized> {
  service: BlockchainService

  constructor(service: BlockchainService) {
    super(service.normalizedRepository, 'normalized')
    this.service = service
  }

  addRoutes(router: Router): any {
    router.post(`/${this.resourcePath}/hint`, async (ctx: any) => {
      const body = await ctx.request.body
      const { ntxId, txId } = JSON.parse(body)
      if (!ntxId || !txId) {
        ctx.response.body = `{"error": "Missing JSON body with 'ntxId', 'txId' fields"}`
        return
      }
      await this.service.normalizedRepository.persist(
        this.service.normalizedRepository.create({ ntxId, txId })
      )
      ctx.response.body = `{"success": true}`
    })
    router.get(`/${this.resourcePath}/ntxd/:id`, async (ctx: any) => {
      const id = ctx.request.get('id')
      ctx.response.body = await this.service.getTxId(id)
    })
  }
}

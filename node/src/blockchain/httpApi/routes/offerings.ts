import 'reflect-metadata'
import * as Koa from 'koa'

import BlockchainService from '../../domainService'
import Route from '../route'
import Offering from '../../orm/domain/offering'
import Router = require('koa-router')
import Context = Koa.Context

export default class OfferingRoute extends Route<Offering> {
  service: BlockchainService

  constructor(service: BlockchainService) {
    super(service.offeringRepository, 'offerings')
    this.service = service
  }
}

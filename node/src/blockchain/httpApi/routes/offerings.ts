import 'reflect-metadata'

import { BlockchainService } from '../../domainService'
import { Route } from '../route'
import Offering from '../../orm/domain/offering'

export default class OfferingRoute extends Route<Offering> {
  service: BlockchainService

  constructor(service: BlockchainService) {
    super(service.offeringRepository, 'offerings')
    this.service = service
  }
}

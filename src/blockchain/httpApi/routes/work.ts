import 'reflect-metadata'

import BlockchainService from '../../service'
import Route from '../route'
import Work from '../../orm/derived/work'

export default class WorkRoute extends Route<Work> {
  service: BlockchainService

  constructor(service: BlockchainService) {
    super(service.workRepository, 'works')
    this.service = service
  }

  async getItem(id: string) {
    const work = await this.service.getWorkFull(id)
    const claim = await this.service.getClaim(id)
    return { ...claim, ...work }
  }
}

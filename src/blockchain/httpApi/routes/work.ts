import 'reflect-metadata'

import BlockchainService from '../../service'
import Route from '../route'
import Work from '../../orm/derived/work'

export default class WorkRoute extends Route<Work> {
  constructor(service: BlockchainService) {
    super(service.workRepository, 'works')
  }

  async getItem(id: string) {
    return this.repository.findOneById(id, {
      alias: "work",
      leftJoin: {
        "title": "work.title",
        "licenses": "work.licenses",
        "offerings": "work.offerings"
      }
    })
  }
}

import 'reflect-metadata'

import BlockchainService from '../../service'
import CreativeWork from '../../orm/creativeWork'
import Route from '../../../../helpers/route'

export default class WorkRoute extends Route<CreativeWork> {
  constructor(service: BlockchainService) {
    super(service.workRepository, 'works')
  }

  async getItem(id: string) {
    return this.repository.findOneById(id, {
      alias: "work",
      leftJoin: {
        "attributes": "work.attributes",
        "title": "work.title",
        "licenses": "work.licenses",
        "offerings": "work.offerings"
      }
    })
  }
}

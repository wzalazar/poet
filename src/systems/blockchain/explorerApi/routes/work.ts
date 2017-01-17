import Route from '../../../../helpers/route'
import CreativeWork from '../../orm/creativeWork'
import BlockchainService from '../../service'

export default class WorkRoute extends Route<CreativeWork> {
  constructor(service: BlockchainService) {
    super(service.workRepository, 'works')
  }

  async getItem(id: string) {
    return this.repository.createQueryBuilder()
  }
}

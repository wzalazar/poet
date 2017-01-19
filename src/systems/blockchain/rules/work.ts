import BlockchainService from '../service'
import { BlockMetadata } from '../../../events'
import { CREATIVE_WORK, Claim } from '../../../model/claim'

export default {
  type: CREATIVE_WORK,
  hook: async (service: BlockchainService, claim: Claim, txInfo: BlockMetadata) => {
    return await service.workRepository.persist(service.workRepository.create({
      id: claim.id,

    }))
  }
}

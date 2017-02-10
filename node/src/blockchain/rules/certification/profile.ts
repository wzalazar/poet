import BlockchainService from '../../domainService'
import { BlockMetadata } from '../../../events'
import { Claim, PROFILE } from '../../../claim'

export default {
  type: PROFILE,
  hook: async (service: BlockchainService, claim: Claim, txInfo: BlockMetadata) => {
    return await service.profileRepository.persist(
      service.profileRepository.create({
        id: claim.publicKey,
        claim: claim.id
      })
    )
  }
}

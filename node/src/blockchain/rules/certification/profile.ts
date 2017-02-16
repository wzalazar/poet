import BlockchainService from '../../domainService'
import { BlockMetadata } from '../../../events'
import { Claim, PROFILE } from '../../../claim'
import Fields from '../../fields';

export default {
  type: PROFILE,
  hook: async (service: BlockchainService, claim: Claim, txInfo: BlockMetadata) => {
    return await service.profileRepository.persist(
      service.profileRepository.create({
        id: claim.publicKey,
        displayName: claim.attributes[Fields.DISPLAY_NAME],
        claim: claim.id
      })
    )
  }
}

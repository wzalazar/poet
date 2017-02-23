import BlockchainService from '../../domainService'
import { BlockMetadata } from '../../../events'
import { Claim, PROFILE } from '../../../claim'
import Fields from '../../fields';
import { EventType } from '../../orm/events/events';

export default {
  type: PROFILE,
  hook: async (service: BlockchainService, claim: Claim, txInfo: BlockMetadata) => {

    const profile = service.profileRepository.create({
      id: claim.publicKey,
      displayName: claim.attributes[Fields.DISPLAY_NAME],
      claim: claim.id
    })

    await service.saveEvent(claim.id, EventType.PROFILE_CREATED, null, profile)

    return await service.profileRepository.persist(profile)
  }
}

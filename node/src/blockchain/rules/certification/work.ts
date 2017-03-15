import BlockchainService from '../../domainService'
import { BlockMetadata } from '../../../events'
import { WORK, Claim } from '../../../claim'
import Fields from '../../fields'
import { EventType } from '../../orm/events/events';

export default {
  type: WORK,
  hook: async (service: BlockchainService, claim: Claim, txInfo: BlockMetadata) => {
    const authorId = claim.attributes[Fields.AUTHOR]

    const work = await service.storeWork({
      id: claim.id,
      displayName: claim.attributes[Fields.WORK_NAME],
      author: authorId as any
    })

    await service.saveEvent(claim.id, EventType.WORK_CREATED, work, await service.profileRepository.findOneById(claim.publicKey))

    return work
  }
}

import BlockchainService from '../../domainService'
import { BlockMetadata } from '../../../events'
import { Claim, OFFERING } from '../../../claim'
import Fields from '../../fields'
import { EventType } from '../../orm/events/events';

const Reference = Fields.REFERENCE
const OfferingType = Fields.OFFERING_TYPE
const OfferingInfo = Fields.OFFERING_INFO

export default {
  type: OFFERING,
  hook: async (service: BlockchainService, claim: Claim, txInfo: BlockMetadata) => {
    const referenceId = claim.attributes[Reference]
    if (!referenceId) {
      console.log('Received weird license with no "reference" field', claim)
      return
    }
    const reference = await service.getWork(referenceId)
    const owner = await service.getOwnerPublicKey(referenceId)
    if (claim.publicKey !== owner) {
      console.log('User does not control work, can not extend license', claim)
      return
    }

    await service.saveEvent(claim.id, EventType.LICENSE_OFFERED, reference, await service.profileRepository.findOneById(owner))

    return await service.offeringRepository.persist(
      service.offeringRepository.create({
        id: claim.id,
        reference: reference,
        owner: owner,
        offeringType: claim.attributes[OfferingType],
        offeringInfo: claim.attributes[OfferingInfo],
      }
    ))
  }
}
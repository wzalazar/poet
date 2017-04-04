import BlockchainService from '../../domainService'
import { BlockMetadata } from '../../../events'
import { Claim, TITLE } from '../../../claim'
import Fields from '../../fields'
import { EventType } from '../../orm/events/events';
import { validateBitcoinPayment } from './license';

const Reference = Fields.REFERENCE
const Owner = Fields.OWNER_KEY
const ReferenceOffering = Fields.REFERENCE_OFFERING

export default {
  type: TITLE,
  hook: async (service: BlockchainService, claim: Claim, txInfo: BlockMetadata) => {
    const referenceId = claim.attributes[Reference]
    if (!referenceId) {
      console.log('Odd title: no reference', claim)
      return
    }
    const ownerId = claim.attributes[Owner]
    console.log('owner is', ownerId, claim)
    if (!ownerId) {
      console.log('Odd title: no owner', claim)
      return
    }
    const work = await service.workRepository.findOneById(referenceId)

    const offeringId = claim.attributes[ReferenceOffering]
    if (offeringId) {
      try {
        const validation = await validateBitcoinPayment(service, claim, txInfo, work)
        if (validation === false) {
          console.log('validation failed')
          return
        }
        const offering = validation.referenceOffering
        if (offering.offeringType !== 'for-sale') {
          return
        }
      } catch (e) {
        console.log('Error validating bitcoin payment', e, e.stack)
        return
      }
    }

    const owner = await service.getOrCreateProfile(ownerId)
    await service.titleRepository.query(`DELETE FROM "title" WHERE "title"."reference"='${work.id}'`)

    const title = await service.titleRepository.persist(
      service.titleRepository.create({
        id: claim.id,
        reference: work,
        owner: owner
      })
    )

    if (work) {
      work.title = title
      if (owner) {
        await service.saveEvent(claim.id, EventType.TITLE_ASSIGNED, work, owner)
        work.owner = owner
      }
      await service.workRepository.persist(work)
    }
    return title
  }
}

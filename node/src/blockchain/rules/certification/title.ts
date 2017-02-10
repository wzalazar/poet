import BlockchainService from '../../domainService'
import { BlockMetadata } from '../../../events'
import { Claim, TITLE } from '../../../claim'
import Fields from '../../fields'

const Reference = Fields.REFERENCE
const Owner = Fields.OWNER_KEY

export default {
  type: TITLE,
  hook: async (service: BlockchainService, claim: Claim, txInfo: BlockMetadata) => {
    const referenceId = claim.attributes[Reference]
    if (!referenceId) {
      console.log('Odd title: no reference', claim)
      return
    }
    const ownerId = claim.attributes[Owner]
    if (!ownerId) {
      console.log('Odd title: no owner', claim)
      return
    }
    const work = await service.workRepository.findOneById(referenceId)
    const owner = await service.profileRepository.findOneById(ownerId)
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
        work.owner = owner
      }
      await service.workRepository.persist(work)
    }
    return title
  }
}

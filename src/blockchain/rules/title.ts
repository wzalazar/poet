import BlockchainService from '../service'
import { BlockMetadata } from '../../events'
import { Claim, TITLE } from '../../claim'
import Fields from '../fields'

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
    const reference = await service.workRepository.findOneById(referenceId)
    const owner = await service.profileRepository.findOneById(ownerId)
    return await service.titleRepository.persist(
      service.titleRepository.create({
        id: claim.publicKey,
        reference: reference,
        owner: owner
      })
    )
  }
}

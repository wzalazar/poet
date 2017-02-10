import BlockchainService from '../../domainService'
import { BlockMetadata } from '../../../events'
import { WORK, Claim } from '../../../claim'
import Fields from '../fields'

export default {
  type: WORK,
  hook: async (service: BlockchainService, claim: Claim, txInfo: BlockMetadata) => {
    const authorId = claim.attributes[Fields.AUTHOR]
    const author = await service.profileRepository.findOneById(authorId)
    return await service.workRepository.persist(service.workRepository.create({
      id: claim.id,
      author
    }))
  }
}

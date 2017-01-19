import BlockchainService from '../service'
import { BlockMetadata } from '../../events'
import { WORK, Claim } from '../../claim'

export default {
  type: WORK,
  hook: async (service: BlockchainService, claim: Claim, txInfo: BlockMetadata) => {
    const authorId = claim.attributes['author']
    const author = service.profileRepository.findOneById(authorId)
    return await service.workRepository.persist(service.workRepository.create({
      id: claim.id,
      author
    }))
  }
}

import BlockchainService from '../../domainService'
import { BlockMetadata } from '../../../events'
import { WORK, Claim } from '../../../claim'
import Fields from '../../fields'
import { EventType } from '../../orm/events/events';

export const HEXA = new RegExp('^[a-fA-F0-9]+$', 'gi')

export function looksLikePublicKey(key: string) {
  if (!key) {
    return false
  }
  if (key.length !== 66) {
    return false
  }
  if (!HEXA.exec(key)) {
    return false
  }
  if (key[0] !== '0' && (key[1] !== '2' || key[1] !== '3')) {
    return false
  }
  return true
}

export default {
  type: WORK,
  hook: async (service: BlockchainService, claim: Claim, txInfo: BlockMetadata) => {
    const authorId = claim.attributes[Fields.AUTHOR]
    const author = looksLikePublicKey(authorId)
      ? await service.getOrCreateProfile(authorId)
      : undefined
    const supersedes = claim.attributes[Fields.SUPERSEDES]

    if (supersedes) {
      const supersededWorkOwner = await service.getOwnerPublicKey(supersedes)
      if (claim.publicKey !== supersededWorkOwner) {
        console.log('User does not control the superseded work', claim)
        return
      }
    }

    const work = await service.upsertWork(
      claim.id,
      author,
      claim.attributes[Fields.WORK_NAME],
      supersedes)

    await service.saveEvent(
      claim.id,
      supersedes ? EventType.WORK_MODIFIED : EventType.WORK_CREATED,
      work,
      await service.profileRepository.findOneById(claim.publicKey))

    return work
  }
}

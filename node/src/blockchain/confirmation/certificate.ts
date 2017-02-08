import BlockchainService from '../service'
import { BlockMetadata } from '../../events'
import { Claim, CERTIFICATE } from '../../claim'
import Fields from '../fields'

const Reference = Fields.REFERENCE
const Owner = Fields.OWNER_KEY

export default {
  type: CERTIFICATE,
  hook: async (service: BlockchainService, claim: Claim, txInfo: BlockMetadata) => {
    const referenceId = claim.attributes[Reference]
    if (!referenceId) {
      console.log('Odd certificate: no reference', claim)
      return
    }
    const notaryApproves = await service.notaryApproval(claim)
    if (notaryApproves) {
      const reference = await service.getClaim(referenceId)
      if (!reference) {
        console.log('problem with certificate: no referred claim found')
        return
      }
      service.certifyClaim(reference, txInfo)
    }
  }
}

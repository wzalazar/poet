import BlockchainService from '../../domainService'
import { BlockMetadata } from '../../../events'
import { Claim, OFFERING } from '../../../claim'
import Fields from '../../fields'

const Reference = Fields.REFERENCE
const ReferenceOwner = Fields.REFERENCE_OWNER

export default {
  type: OFFERING,
  hook: async (service: BlockchainService, claim: Claim, txInfo: BlockMetadata) => {
    if (claim.attributes[Reference]) {
      await service.linkClaims(claim.attributes[Reference], claim.id)
    }
    if (claim.attributes[ReferenceOwner]) {
      await service.linkClaims(claim.attributes[ReferenceOwner], claim.id)
    }
  }
}

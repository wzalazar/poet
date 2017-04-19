import BlockchainService from '../../domainService'
import { BlockMetadata } from '../../../events'
import { Claim, LICENSE } from '../../../claim'
import Fields from '../../fields'

const Reference = Fields.REFERENCE
const ReferenceOffering = Fields.REFERENCE_OFFERING
const Holder = Fields.LICENSE_HOLDER
const ReferenceOwner = Fields.REFERENCE_OWNER

export default {
  type: LICENSE,
  hook: async (service: BlockchainService, claim: Claim, txInfo: BlockMetadata) => {
    if (claim.attributes[Reference]) {
      await service.linkClaims(claim.attributes[Reference], claim.id)
    }
    if (claim.attributes[ReferenceOwner]) {
      await service.linkClaims(claim.attributes[ReferenceOwner], claim.id)
    }
    if (claim.attributes[Holder]) {
      await service.linkClaims(claim.attributes[Holder], claim.id)
    }
    if (claim.attributes[ReferenceOffering]) {
      await service.linkClaims(claim.attributes[ReferenceOffering], claim.id)
    }
  }
}

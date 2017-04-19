import BlockchainService from '../../domainService';
import { BlockMetadata } from '../../../events';
import { Claim, TITLE } from '../../../claim';
import Fields from '../../fields';

const Reference = Fields.REFERENCE
const Owner = Fields.OWNER_KEY
const ReferenceOffering = Fields.REFERENCE_OFFERING

export default {
  type: TITLE,
  hook: async (service: BlockchainService, claim: Claim, txInfo: BlockMetadata) => {
    if (claim.attributes[Reference]) {
      await service.linkClaims(claim.attributes[Reference], claim.id)
    }
    if (claim.attributes[Owner]) {
      await service.linkClaims(claim.attributes[Owner], claim.id)
    }
    if (claim.attributes[ReferenceOffering]) {
      await service.linkClaims(claim.attributes[ReferenceOffering], claim.id)
    }
  }
}

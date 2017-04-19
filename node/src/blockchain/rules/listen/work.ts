import BlockchainService from '../../domainService';
import { BlockMetadata } from '../../../events';
import { Claim, WORK } from '../../../claim';
import Fields from '../../fields';
import { looksLikePublicKey } from '../../../common';

export default {
  type: WORK,
  hook: async (service: BlockchainService, claim: Claim, txInfo: BlockMetadata) => {
    const authorId = claim.attributes[Fields.AUTHOR]
    if (looksLikePublicKey(authorId)) {
      await service.linkClaims(claim.attributes[Fields.AUTHOR], claim.id)
    }
  }
}

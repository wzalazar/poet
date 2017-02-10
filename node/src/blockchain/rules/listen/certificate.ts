import BlockchainService from "../../domainService";
import {BlockMetadata} from "../../../events";
import {Claim, CERTIFICATE} from "../../../claim";
import Fields from "../fields";

const Reference = Fields.REFERENCE

export default {
  type: CERTIFICATE,
  hook: async (service: BlockchainService, claim: Claim, txInfo: BlockMetadata) => {
    const referenceId = claim.attributes[Reference]
    if (!referenceId) {
      console.log('Odd certificate: no reference', claim)
      return
    }
    const notaryApproves = await service.certificationService.notaryApproval(claim)
    if (notaryApproves) {
      const reference = await service.getClaim(referenceId)
      if (!reference) {
        console.log('problem with certificate: no referred claim found')
        return
      }
      service.certificationService.certifyClaim(reference, txInfo)
    }
  }
}

import { ClaimTypes, Fields } from 'poet-js'

import BlockchainService from '../../domainService'
import { BlockMetadata } from '../../../events'
import { Claim } from '../../../claim' // TODO: Use poet-js' Claim (incompatible)

export const OfferingRule = {
  type: ClaimTypes.OFFERING,
  hook: async (service: BlockchainService, claim: Claim, txInfo: BlockMetadata) => {
    if (claim.attributes[Fields.REFERENCE]) {
      await service.linkClaims(claim.attributes[Fields.REFERENCE], claim.id)
    }
    if (claim.attributes[Fields.REFERENCE_OWNER]) {
      await service.linkClaims(claim.attributes[Fields.REFERENCE_OWNER], claim.id)
    }
  }
}

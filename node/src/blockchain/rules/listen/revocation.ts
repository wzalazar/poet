import { ClaimTypes } from 'poet-js'

import BlockchainService from '../../domainService'
import { BlockMetadata } from '../../../events'
import { Claim } from '../../../claim' // TODO: Use poet-js' Claim (incompatible)

export const RevocationRule = {
  type: ClaimTypes.REVOCATION,
  hook: async (service: BlockchainService, claim: Claim, txInfo: BlockMetadata) => {
    // TODO: Logic for unconfirming information
    return
  }
}

import BlockchainService from '../../domainService'
import { BlockMetadata } from '../../../events'
import { Claim, REVOCATION } from '../../../claim'
import Fields from '../fields'

const Reference = Fields.REFERENCE
const Owner = Fields.OWNER_KEY

export default {
  type: REVOCATION,
  hook: async (service: BlockchainService, claim: Claim, txInfo: BlockMetadata) => {
    // TODO: Logic for unconfirming information
    return
  }
}

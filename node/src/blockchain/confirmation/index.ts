import { BlockMetadata } from '../../events'
import { Claim, ClaimType } from '../../claim'
import BlockchainService from '../service'

import certificate from './certificate'
import revocation from './revocation'

export interface ConfirmationHook {
  (service: BlockchainService, claim: Claim, info: BlockMetadata): any
}

export interface ConfirmationHookDescription {
  type: ClaimType
  hook: ConfirmationHook
}

const rules: ConfirmationHookDescription[] = []

// Add here certification
rules.push(certificate)
rules.push(revocation)

export default rules
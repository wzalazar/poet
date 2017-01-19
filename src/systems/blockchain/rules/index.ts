import { BlockMetadata } from '../../../events'
import { Claim, ClaimType, CreativeWork } from '../../../model/claim'

export interface Hook {
  (service: BlockchainService, claim: Claim, info: BlockMetadata): any
}

export interface HookDescription {
  type: ClaimType
  hook: Hook
}

const rules: HookDescription[] = []

import workCreation from './work'
import BlockchainService from '../service'

// Add here rules
rules.push(workCreation)

export default rules
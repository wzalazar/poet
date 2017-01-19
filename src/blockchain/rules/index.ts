import { BlockMetadata } from '../../events'
import { Claim, ClaimType } from '../../claim'
import BlockchainService from '../service'

import workCreation from './work'

export interface Hook {
  (service: BlockchainService, claim: Claim, info: BlockMetadata): any
}

export interface HookDescription {
  type: ClaimType
  hook: Hook
}

const rules: HookDescription[] = []

// Add here rules
rules.push(workCreation)

export default rules
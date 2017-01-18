import { BlockMetadata } from '../../../events'
import { Claim, ClaimType } from '../../../model/claim'

export interface Hook {
  (claim: Claim, info: BlockMetadata): any
}

export interface HookDescription {
  type: ClaimType
  hook: Hook
}

const rules: HookDescription[] = []

// Add here rules

export default rules
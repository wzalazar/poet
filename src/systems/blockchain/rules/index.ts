import { PoetTxInfo } from '../../../events'
import { Claim, ClaimType } from '../../../model/claim'

export interface Hook {
  (claim: Claim, info: PoetTxInfo): any
}

export interface HookDescription {
  type: ClaimType
  hook: Hook
}

const rules: HookDescription[] = []

// Add here rules

export default rules
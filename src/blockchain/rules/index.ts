import { BlockMetadata } from '../../events'
import { Claim, ClaimType } from '../../claim'
import BlockchainService from '../service'

import work from './work'
import profile from './profile'
import title from './title'
import offering from './offering'
import license from './license'

export interface Hook {
  (service: BlockchainService, claim: Claim, info: BlockMetadata): any
}

export interface HookDescription {
  type: ClaimType
  hook: Hook
}

const rules: HookDescription[] = []

// Add here rules
rules.push(work)
rules.push(profile)
rules.push(title)
rules.push(offering)
rules.push(license)

export default rules
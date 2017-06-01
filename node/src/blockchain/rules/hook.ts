import { ClaimTypes } from 'poet-js'

import BlockchainService from "../domainService"
import { Claim } from "../../claim"
import { BlockMetadata } from "../../events"

export interface Hook {
  (service: BlockchainService, claim: Claim, info: BlockMetadata): any
}

export interface HookDescription {
  readonly type: ClaimTypes.ClaimType
  readonly hook: Hook
}

import BlockchainService from "../domainService";
import {Claim, ClaimType} from "../../claim";
import {BlockMetadata} from "../../events";

export interface Hook {
  (service: BlockchainService, claim: Claim, info: BlockMetadata): any
}

export interface HookDescription {
  type: ClaimType
  hook: Hook
}

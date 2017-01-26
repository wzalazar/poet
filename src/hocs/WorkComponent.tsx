import Config from '../config';

import { HexString } from '../common'
import FetchComponent, { FetchComponentProps } from './FetchComponent'

export interface Claim {
  id: HexString
  publicKey: HexString
  signature: HexString

  attributes: any
}

export interface ClaimInfo {
  hash: string
  torrentHash: string
  timestamp?: number
  bitcoinHeight?: number
  bitcoinHash?: string
  blockHeight?: number
  blockHash?: string
  transactionOrder?: string
  transactionHash: string
  outputIndex: number
  claimOrder?: number
}

export interface WorkOffering {
  id: string
  owner: string
  offeringType: string
  offeringInfo: any
  attributes: {
    [key: string]: string
  }
  description: string
  licenses: ReadonlyArray<any>
}

export interface WorkProps extends FetchComponentProps, Claim {
  claimInfo?: ClaimInfo
  owner?: Claim
  title?: Claim
  author?: Claim
  offerings?: ReadonlyArray<WorkOffering>
}

export default FetchComponent.bind(null, (props: WorkProps) => ({
  url: `${Config.api.explorer}/works/${props.id}`
}));
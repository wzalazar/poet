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
  readonly id: string
  readonly owner: string
  readonly attributes: {
    readonly [key: string]: string;
    readonly type: string;
    readonly description: string;
    readonly pricingFrequency: string;
    readonly pricingAmount: string;
    readonly pricingCurrency: string;
  }
  readonly licenses: ReadonlyArray<any>
}

export interface WorkProps extends FetchComponentProps, Claim {
  readonly claimInfo?: ClaimInfo
  readonly owner?: Claim
  readonly title?: Claim
  readonly author?: Claim
  readonly offerings?: ReadonlyArray<WorkOffering>
  readonly attributes: {
    readonly [key: string]: string
    readonly name: string;
    readonly publishedAt: string;
    readonly createdAt: string;
    readonly authorPublicKey: string;
    readonly author: string;
    readonly lastModified: string;
    readonly tags: string;
    readonly type: string;
    readonly articleType: string;
    readonly content?: string;
  }
}

export default FetchComponent.bind(null, (props: WorkProps) => ({
  url: `${Config.api.explorer}/works/${props.id}`
}));
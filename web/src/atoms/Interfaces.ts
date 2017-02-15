type HexString = string;

export interface Profile {
  readonly attributes: {
    displayName: string;
  }
}

export interface Claim {
  readonly id: HexString
  readonly publicKey: HexString
  readonly signature: HexString

  readonly attributes: {
    readonly [key: string]: string
  }
}

export interface TitleClaim extends Claim {
  readonly attributes: {
    readonly [key: string]: string;
    readonly owner: string;
    readonly typeOfOwnership: string;
    readonly status: string;
  }
}

export interface ClaimInfo {
  readonly hash: string
  readonly torrentHash: string
  readonly timestamp?: number
  readonly bitcoinHeight?: number
  readonly bitcoinHash?: string
  readonly blockHeight?: number
  readonly blockHash?: string
  readonly transactionOrder?: string
  readonly transactionHash: string
  readonly outputIndex: number
  readonly claimOrder?: number
}

export interface WorkOffering extends Claim {
  readonly owner: string
  readonly attributes: {
    readonly [key: string]: string;
    readonly licenseType: string;
    readonly licenseDescription: string;
    readonly pricingFrequency: string;
    readonly pricingPriceAmount: string;
    readonly pricingPriceCurrency: string;
  }
  readonly licenses: ReadonlyArray<any>
}

export interface Work extends Claim {
  readonly claimInfo?: ClaimInfo
  readonly owner?: Claim
  readonly title?: TitleClaim
  readonly author?: Claim
  readonly offerings?: ReadonlyArray<WorkOffering>
  readonly attributes: {
    readonly [key: string]: string
    readonly name: string;
    readonly publishedAt: string;
    readonly createdAt: string;
    readonly authorPublicKey: string;
    readonly authorDisplayName: string;
    readonly lastModified: string;
    readonly tags: string;
    readonly type: string;
    readonly articleType: string;
    readonly content?: string;
  }
}

export interface Offering {
  readonly id: string;
  readonly attributes: {
    readonly licenseType: string;
    readonly licenseDescription: string;
  };
}

export interface License {
  readonly id: string;
  readonly publicKey: string;
  readonly title: string;
  readonly licenseType: string;
  readonly owner: string;

  readonly reference: Work;

  readonly referenceOffering: Offering;

  readonly attributes: {
    readonly licenseHolder: string;
    readonly issueDate: string;
    readonly reference: string;
  }
}


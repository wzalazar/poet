type HexString = string;

export interface Profile {
  readonly id: string
  readonly displayName: string
  readonly attributes: ProfileAttributes;
}

export interface ProfileAttributes {
  readonly displayName?: string;
  readonly name?: string;
  readonly bio?: string;
  readonly url?: string;
  readonly email?: string;
  readonly location?: string;
  readonly imageData?: string;
}

// TODO: lacks a "type" field, duplicated declaration! See Claim.ts
export interface Claim {
  readonly id: HexString
  readonly publicKey: HexString
  readonly signature: HexString

  readonly attributes: { // TODO: should be ReadonlyArray<Attribute>
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
  readonly owner?: {
    readonly claim: HexString;
    readonly displayName: string;
    readonly id: HexString;
  }
  readonly title?: TitleClaim
  readonly author?: {
    readonly claim: HexString;
    readonly displayName: string;
    readonly id: HexString;
  }
  readonly offerings?: ReadonlyArray<WorkOffering>
  readonly attributes: {
    readonly [key: string]: string
    readonly name: string;
    readonly datePublished: string;
    readonly dateCreated: string;
    readonly author: string; // Can be a publicKey referencing a profile or a free text
    readonly lastModified: string;
    readonly contentHash: string;
    readonly tags: string;
    readonly type: string;
    readonly articleType: string;
    readonly content?: string;
  }
}

export interface Offering {
  readonly id: string;
  readonly owner: string;
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

  readonly licenseHolder: Profile;

  readonly reference: Work;
  readonly claimInfo?: ClaimInfo

  readonly referenceOffering: Offering;

  readonly attributes: {
    readonly licenseHolder: string;
    readonly issueDate: string;
    readonly reference: string;
  }
}

export interface BlockInfo {
  readonly torrentHash: string

  readonly transactionHash?: string
  readonly outputIndex?: number

  // Only available if confirmed
  readonly bitcoinHash?: string
  readonly bitcoinHeight?: number
  readonly transactionOrder?: number
  readonly timestamp?: number

  // Only available if downloaded
  readonly hash?: string

  // Only available if indexed
  readonly height?: number
}
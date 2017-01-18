export interface BlockMetadata {
  torrentHash: string

  transactionHash?: string
  outputIndex?: number

  // Only available if confirmed
  transactionOrder?: number
  blockHeight?: number
  blockHash?: string
  timestamp?: number

  // Only available if downloaded
  hash?: string

  // Only available if indexed
  height?: number
}

export interface BitcoinBlockMetadata {
  blockHeight: number
  blockHash: string
  timestamp: number
  poet: BlockMetadata[]
}

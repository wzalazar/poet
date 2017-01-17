export interface PoetTxInfo {
  transactionHash: string
  outputIndex: number
  torrentHash: string

  // Only available if confirmed
  transactionOrder?: number
  blockHeight?: number
  blockHash?: string
  timestamp?: number

  // Only available if downloaded
  poetHash?: string

  // Only available if indexed
  poetHeight?: number
}

export interface PoetBlockInfo {
  blockHeight: number
  blockHash: string
  timestamp: number
  poet: PoetTxInfo[]
}

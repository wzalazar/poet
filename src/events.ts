export interface PoetTxInfo {
  poetBlockHash?: string
  transactionOrder: number
  transactionHash: string
  outputIndex: number
  torrentHash: string
  poetHash: string
}

export interface PoetBlockInfo {
  blockHeight: number
  blockHash: string
  poetHash: string
  timestamp: number
  poetHeight?: number
  poet: PoetTxInfo[]
}

export interface PoetTxInfo {
    blockHash?: string
    blockHeight?: number
    txHash: string
    outputIndex: number
    torrentHash: string
    contentHash: string
}

export interface BitcoinBlockInfo {
    blockHeight: number
    blockHash: string
    poet: PoetTxInfo[]
}

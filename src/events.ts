export interface PoetTxInfo {
    blockHash?: string
    blockHeight?: number
    txHash: string
    outputIndex: number
    torrentHash: string
}

export interface PoetBlockInfo {
    blockHeight: number
    blockHash: string
    poet: PoetTxInfo[]
}

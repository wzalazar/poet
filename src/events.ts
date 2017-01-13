export interface PoetTxInfo {
    blockHash?: string
    blockHeight?: number
    txHash: string
    outputIndex: number
    torrentHash: string
    contentHash: string
}

export interface PoetBlockInfo {
    blockHeight: number
    blockHash: string
    poet: PoetTxInfo[]
}

export interface PoetHashDiscovered {
    hash: string
}

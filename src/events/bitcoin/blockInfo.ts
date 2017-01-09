export interface BlockInfo {
    height: number
    id: string
}

export interface PoetTxInfo {
    blockHash?: string
    blockHeight?: number
    txHash: string
    outputIndex: number
    poetHash: string
}

export interface BitcoinBlockInfo {
    blockHeight: number
    blockHash: string
    poet: PoetTxInfo[]
}

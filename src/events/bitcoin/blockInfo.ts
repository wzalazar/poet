export interface BlockInfo {
    height: number
    id: string
}

export interface PoetTxInfo {
    hash: string
    poetId: string
    blockOrder: number
    outputIndex: number
}

export interface PoetInfo {
    height: number
    id: string
    poet: PoetTxInfo[]
}

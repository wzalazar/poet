export interface BlockInfo {
    height: number
    id: string
}

export interface PoetTxInfo {
    position: number
    hash: string
    poetId: string
}

export interface PoetInfo {
    height: number
    id: string
    poet: PoetTxInfo[]
}

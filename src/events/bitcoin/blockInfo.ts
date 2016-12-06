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

export function validateBlockInfoList(blocks: BlockInfo[]): boolean {
    if (!blocks.length) {
        return false
    }
    return !!blocks.slice(1).reduce(
        (prev: false | number, next: BlockInfo): false | number => {
            if (prev === false) {
                return false
            }
            return next.height === prev + 1 ? next.height : false
        },
        blocks[0].height
    )
}
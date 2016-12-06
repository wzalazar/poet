import * as Model from '../model/claim'

export interface PoetHashDiscovered {
    hash: string
}

export interface PoetBlockReady {
    hash: string
    block: Model.PoetBlock
}

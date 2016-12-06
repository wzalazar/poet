import { PoetBlock } from '../model/claim'

export interface RequireDownload {
    hash: string
}

export interface DownloadError {
    hash: string
    cause: any
}

export interface DownloadFinished {
    hash: string
    block: PoetBlock
}
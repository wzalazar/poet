import { PoetBlock } from '../model'

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
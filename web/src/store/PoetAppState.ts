import { FetchStatus } from '../enums/FetchStatus'

export interface PoetSessionToken {
  publicKey: string
  message: string
  signature: string
}

export interface PoetSession {
  token: PoetSessionToken
  publicKey: string
}

export interface FetchStoreEntry {
  status: FetchStatus
  body?: any
  error?: any
}

export interface FetchStore {
  [key: string]: FetchStoreEntry
}

export interface PoetAppState {
  session: PoetSession
  fetch: FetchStore
}

export default PoetAppState;

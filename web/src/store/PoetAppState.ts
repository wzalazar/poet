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

export interface FetchStoreEntry<T> {
  status: FetchStatus
  body?: T
  error?: any
  headers?: Headers;
}

export interface FetchStore {
  [key: string]: FetchStoreEntry<any>
}

export interface PoetAppState {
  session: PoetSession
  fetch: FetchStore
  modals: ModalStore
  transfer: TransferStore
}

export interface ModalStore {
  transfer: any
}

export interface TransferStore {
  id: string
  success: boolean
  targetPublicKey: string

}

export default PoetAppState;

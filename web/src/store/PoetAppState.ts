import { FetchStatus } from '../enums/FetchStatus'
import { Claim } from '../Claim';

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
  createWork: CreateWorkStore;
}

export interface ModalStore {
  login?: boolean;
  signWork?: boolean;
  signTx?: boolean;
  transfer?: boolean;
  purchaseLicense?: boolean;
  createWorkResult?: boolean;
}

export interface TransferStore {
  id: string
  success: boolean
  targetPublicKey: string
}

export interface CreateWorkStore {
  readonly workClaim: Claim;
}

export default PoetAppState;

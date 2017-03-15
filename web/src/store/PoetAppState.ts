import { FetchStatus } from '../enums/FetchStatus'
import { Claim } from '../Claim';
import { WorkOffering, Work } from '../atoms/Interfaces';

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

export interface NotificationEvent {
  id: number,
  type: number,
  timestamp: number,
  claimReference: string,
  workId: string,
  workDisplayName?: string,
  actorId: string,
  actorDisplayName?: string
}

export interface Notification {
  id: number,
  user: string,
  read: boolean,
  event: NotificationEvent
}

export interface NotificationsStore {
  notifications: ReadonlyArray<Notification>
  unreadCount: number
  totalCount: number
}

export interface ProfileStore {
  notifications: NotificationsStore
}

export interface PoetAppState {
  session: PoetSession
  profile: ProfileStore
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
  readonly purchaseLicense?: PurchaseLicenseStore;
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

export interface PurchaseLicenseStore {
  readonly offering: WorkOffering;
  readonly work: Work;
  readonly visible: boolean;
  readonly success?: boolean;
}

export default PoetAppState;

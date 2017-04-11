import { FetchStatus } from '../enums/FetchStatus'
import { Claim } from '../Claim';
import { WorkOffering, Work } from '../Interfaces';

export interface PoetAppState {
  readonly session: SessionStore
  readonly profile: ProfileStore
  readonly fetch: FetchStore
  readonly modals: ModalStore
  readonly transfer: TransferStore
  readonly createWork: CreateWorkStore;
  readonly signTx: SignTransactionStore;
}

export interface SessionStore {
  readonly token: SessionToken
  readonly publicKey: string
}

export interface SessionToken {
  readonly publicKey: string
  readonly message: string
  readonly signature: string
}

export interface ProfileStore {
  readonly notifications: NotificationsStore
}

export interface NotificationsStore {
  readonly notifications: ReadonlyArray<Notification>;
  readonly unreadCount: number
  readonly totalCount: number
}

export interface Notification {
  readonly id: number,
  readonly user: string,
  readonly read: boolean,
  readonly event: NotificationEvent
}

export interface NotificationEvent {
  readonly id: number,
  readonly type: number,
  readonly timestamp: number,
  readonly claimReference: string,
  readonly workId: string,
  readonly workDisplayName?: string,
  readonly actorId: string,
  readonly actorDisplayName?: string
}

export interface FetchStore {
  [key: string]: FetchStoreEntry<any>
}

export interface FetchStoreEntry<T> {
  readonly status: FetchStatus
  readonly body?: T
  readonly error?: any
  readonly headers?: Headers;
}

export interface ModalStore {
  readonly login?: boolean;
  readonly signWork?: boolean;
  readonly signTx?: boolean;
  readonly transfer?: boolean;
  readonly purchaseLicense?: PurchaseLicenseStore;
  readonly createWorkResult?: boolean;
  readonly tryItOut?: boolean;
}

export interface PurchaseLicenseStore {
  readonly offering: WorkOffering;
  readonly work: Work;
  readonly visible: boolean;
  readonly success?: boolean;
}

export interface TransferStore {
  readonly id: string
  readonly success: boolean
  readonly targetPublicKey: string
}

export interface CreateWorkStore {
  readonly workClaim: Claim;
}

export interface SignTransactionStore {
  readonly id: any;
  readonly submitting: boolean;
  readonly success: boolean;
  readonly noBalance: boolean;
}
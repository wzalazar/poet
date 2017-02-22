import { Actions } from './index';

export interface DispatchesTransferRequested {
  transferRequested(workId: string): void
}

export interface TransferRequestedAction {
  type: string,
  payload: {
    workId: string
  }
}


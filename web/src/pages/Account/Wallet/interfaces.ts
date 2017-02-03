export interface WithdrawalInfo {
  amountInSatoshis?: number
  paymentAddress?: string
}

export interface WithdrawBoxProps {
  address: string
  requestWithdrawal: (_: WithdrawalInfo) => void
}

export interface UnspentTransactionOutput {
  txid: string,
  vout: number,
  satoshis: number,
  confirmations: number,
  ts: number
}

export type UnspentTransactionOutputs = UnspentTransactionOutput[];

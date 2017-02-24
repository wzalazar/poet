export interface WithdrawalInfo {
  amountInSatoshis?: number
  paymentAddress?: string
}

export interface WithdrawBoxProps {
  address: string
  requestWithdrawal: (_: WithdrawalInfo) => void
}

export interface UnspentTransactionOutput {
  readonly txid: string;
  readonly vout: number;
  readonly satoshis: number;
  readonly confirmations: number;
  readonly ts: number;
  readonly amount: number;
}

export type UnspentTransactionOutputs = UnspentTransactionOutput[];

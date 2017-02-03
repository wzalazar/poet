import * as React from 'react';
import { UnspentTransactionOutputs } from '../interfaces'

export function BalanceBox(props: { outputs: UnspentTransactionOutputs }) {
  return <p>Balance: {props.outputs.reduce((sum, next) => sum + next.satoshis, 0)} satoshis</p>;
}


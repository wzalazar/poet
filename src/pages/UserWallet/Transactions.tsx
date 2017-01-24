import * as React from 'react';

import Config from '../../config';

import FetchComponent, { FetchComponentProps } from '../../hocs/FetchComponent';

interface TransactionsProps extends FetchComponentProps {
  userId?: string;
}

function propsToUrl(props: TransactionsProps) {
  return {
    url: `http://localhost:4000${Config.api.user}/${props.userId}/transactions`
  };
}

function render(props: TransactionsProps) {
  return (
    <table className="table table-highlight">
      <thead>
        <tr>
          <td>Date</td>
          <td>Type</td>
          <td>Amount</td>
        </tr>
      </thead>
      <tbody>
        { props.elements.map(renderTransaction) }
      </tbody>
    </table>
  )
}

function renderTransaction(transaction: any) {
  return (
    <tr>
      <td>{transaction.date}</td>
      <td>{transaction.type}</td>
      <td>{transaction.amount}</td>
    </tr>
  )
}

export default FetchComponent.bind(null, propsToUrl, render)();
import * as React from 'react'

import { Table } from 'antd'
import { Container, Title, ApiValueFromRoute } from '../atoms'

import { ClaimRow } from '../poetAtoms'

export const BlockDetail = ApiValueFromRoute('block',
  result => {
    return (<Container>
      <Title>Block {result.id}</Title>
      <div>Locator: <tt>block:{result.bitcoinBlockOrder}/tx:{result.transactionOrder}:{result.outputOrder}/{result.bitcoinBlock}:{result.bitcoinTransaction}</tt></div>
      <h4>Claims</h4>
      { result.claims.map(claim => <ClaimRow key={'claim-' + claim.id} {...claim} />) }
    </Container>)
  }
)
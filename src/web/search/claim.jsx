import * as React from 'react'

import { Table } from 'antd'
import { Container, Title, ApiValueFromRoute } from '../atoms'

import { CreativeWorkWithLink, OwnerNameWithLink, IssuerNameWithLink } from '../poetAtoms'

export const ClaimDetail = ApiValueFromRoute('claim',
  result => {
    switch (result.type) {
      case 'Profile':
        return (<Container>
          <Title>Profile for {result.attributes.name}</Title>
          <div>PublicKey: { result.publicKey } </div>
          <div>Contact Info: { result.attributes.contactInfo } </div>
          <div>Raw:</div>
          <pre> {JSON.stringify(result, null, 2)}</pre>
        </Container>)
      case 'Title':
        return (<Container>
          <Title>Title of Ownership</Title>
          <div>For Creative: <CreativeWorkWithLink id={result.attributes.for} /></div>
          <div>Owner: <OwnerNameWithLink id={result.attributes.for} /></div>
          <pre> {JSON.stringify(result, null, 2)}</pre>
        </Container>)
      case 'CreativeWork':
        return (<Container>
          <Title>Creative Work: { result.attributes.name }</Title>
          <div>Issuer: <IssuerNameWithLink id={result.id} /></div>
          <div>Owner: <OwnerNameWithLink id={result.id} /></div>
          <pre> {JSON.stringify(result, null, 2)}</pre>
        </Container>)
       default:
        return (<Container>
          <Title>Claim of type {result.type}</Title>
          <div>Claim id: {result.id}</div>
          <div>PublicKey: { result.publicKey } </div>
          <div>Raw:</div>
          <pre> {JSON.stringify(result, null, 2)}</pre>
        </Container>)
    }
  }
)
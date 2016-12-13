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
          <p>PublicKey: { result.publicKey } </p>
          <p>Contact Info: { result.attributes.contactInfo } </p>
          <p>Raw:</p>
          <pre> {JSON.stringify(result, null, 2)}</pre>
        </Container>)
      case 'Title':
        return (<Container>
          <Title>Title of Ownership</Title>
          <p>For Creative: <CreativeWorkWithLink id={result.attributes.for} /></p>
          <p>Owner: <OwnerNameWithLink id={result.attributes.for} /></p>
          <pre> {JSON.stringify(result, null, 2)}</pre>
        </Container>)
      case 'CreativeWork':
        return (<Container>
          <Title>Creative Work: { result.attributes.name }</Title>
          <p>Issuer: <IssuerNameWithLink id={result.id} /></p>
          <p>Owner: <OwnerNameWithLink id={result.id} /></p>
          <pre> {JSON.stringify(result, null, 2)}</pre>
        </Container>)
       default:
        return (<Container>
          <Title>Claim of type {result.type}</Title>
          <p>Claim id: {result.id}</p>
          <p>PublicKey: { result.publicKey } </p>
          <p>Raw:</p>
          <pre> {JSON.stringify(result, null, 2)}</pre>
        </Container>)
    }
  }
)
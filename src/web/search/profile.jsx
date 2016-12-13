import * as React from 'react'

import { Table } from 'antd'
import { Container, Title, ApiValueFromRoute } from '../atoms'

export const ProfileDetail = ApiValueFromRoute('claim',
  result => {
    return (<Container>
      <Title>Profile for {result.attributes.name}</Title>
      <p>PublicKey: { result.publicKey } </p>
      <p>Contact Info: { result.attributes.contactInfo } </p>
      <p>Raw:</p>
      <pre> {JSON.stringify(result, null, 2)}</pre>
    </Container>)
  }
)
import * as React from 'react'

import { Table } from 'antd'
import { Container, Title, ApiValue } from '../atoms'

export const ClaimDetail = ApiValue('claim',
  result => {
    return (<Container>
      <Title>Claim {result}</Title>
    </Container>)
  }
)
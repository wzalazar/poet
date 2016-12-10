import * as React from 'react'

import { Table } from 'antd'
import { Container, Title, ApiValue } from '../atoms'

export const BlockDetail = ApiValue('block',
  result => {
    return (<Container>
      <Title>Block {result}</Title>
    </Container>)
  }
)
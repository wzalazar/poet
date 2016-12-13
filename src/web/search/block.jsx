import * as React from 'react'

import { Table } from 'antd'
import { Container, Title, ApiValueFromRoute } from '../atoms'

export const BlockDetail = ApiValueFromRoute('block',
  result => {
    return (<Container>
      <Title>Block {result.id}</Title>
      <pre>
        {JSON.stringify(result, null, 2)}
      </pre>
    </Container>)
  }
)
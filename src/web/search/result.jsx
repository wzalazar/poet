import * as React from 'react'

import { Table } from 'antd'
import { Container, Title, ApiValueFromRoute } from '../atoms'

export const Search = ApiValueFromRoute('search',
  result => {
    return (<Container>
      <Title>Results for <strong>"{JSON.stringify(result, null, 2)}"</strong></Title>
    </Container>)
  }
)
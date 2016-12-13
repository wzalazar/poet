import * as React from 'react'

import { Table } from 'antd'
import { Container, Title, ApiValueFromRoute } from '../atoms'

import { ClaimRow as SearchResultRow } from '../poetAtoms'

export const Search = ApiValueFromRoute('search',
  (result, props) => {
    return (<Container>
      <Title>Results for { props.path.split('/')[1] }</Title>
      { result.map(SearchResultRow) }
      <pre> <strong>"{JSON.stringify(result, null, 2)}"</strong></pre>
    </Container>)
  }
)
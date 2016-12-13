import * as React from 'react'

import { Table } from 'antd'
import { Container, Title, ApiValue } from '../atoms'

export const ProfileDetail = ApiValue('profile',
  result => {
    return (<Container>
      <Title>Profile {JSON.stringify(result)}</Title>
    </Container>)
  }
)
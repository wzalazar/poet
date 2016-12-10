import * as React from 'react'
import { Table } from 'antd'
import styled from 'styled-components'

import { CollectionValue, ApiValue, Container, Title } from '../atoms'

const BlockList = CollectionValue('all_blocks', (data) => {
  return JSON.stringify(data)
})

class ExplorerContainer extends React.Component {
  render() {
    const columns = [{
      title: 'Hash of Block',
      dataIndex: 'id',
      key: 'id'
    }, {
      title: 'Height',
      dataIndex: 'height',
      key: 'height'
    }]
    return (<Container>
      <Title>Explorer</Title>
      <BlockList />
      { this.props.blocks &&
        <div>
          <TitleLatest>Latest bitcoin blocks</TitleLatest>
          <Table dataSource={this.props.blocks} columns={columns} pagination={false}/>
        </div>
      }
    </Container>)
  }
}

export const Explorer = connect(state => ({
  connection: state.connection,
  blocks: state.connection && state.connection.blockState,
  blockMapping: state.blockMapping
}), {})(ExplorerContainer)
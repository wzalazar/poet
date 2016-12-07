import * as React from 'react'

import { Table } from 'antd'

import styled from 'styled-components'

const TitleLatest = styled.h3`
  margin-top: 20px;
  font-size: 16px;
  margin-bottom: 20px;
`

const Container = styled.div`
  padding-top: 80px;
  padding-left: 5%;
  padding-right: 5%;
`

import { connect } from 'react-redux'

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
      <h2>Explorer</h2>
      { this.props.blockMapping &&
        <div>
          <TitleLatest>Latest Poet blocks</TitleLatest>
          <Table dataSource={this.props.blockMapping} columns={columns} pagination={false}/>
        </div>
      }
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
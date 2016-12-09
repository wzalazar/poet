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

class SearchContainer extends React.Component {
  render() {
    return (<Container>
      {this.props.q}
    </Container>)
  }
}

export const Search = connect((state, ownProps) => ({
  q: ownProps.location.query.q
}), {})(SearchContainer)
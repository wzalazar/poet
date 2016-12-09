import * as React from 'react'
import fetch from 'isomorphic-fetch'
import { Table } from 'antd'

import styled from 'styled-components'

const Title = styled.h3`
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
  componentWillMount() {
    const { result, loading, error } = this.props
    if (!result && !loading && !error) {
      this.props.fetch(this.props.query)
    }
  }
  render() {
    const { result, loading, error } = this.props
    return (<Container>
      <Title>Results for <strong>"{this.props.query}"</strong></Title>
      { loading && 'Loading...' }
    </Container>)
  }
}

export const Search = connect((state, ownProps) => ({
  query: ownProps.location.query.q,
  result: state.search.result,
  loading: state.search.loading,
  error: state.search.error
}), {
  fetch: (query) => {
    return function(dispatch) {
      dispatch({ type: 'searching', payload: query })
      return fetch('/api/search?q=' + query)
        .then(res => res.json())
        .then(body => {
          dispatch({ type: 'search result', payload: body.results })
        })
        .catch(e => {
          dispatch({ type: 'search error', payload: e })
        })
    }
  }
})(SearchContainer)
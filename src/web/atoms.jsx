import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'

export const Title = styled.h3`
  font-size: 16px;
  margin-bottom: 20px;
`

export const Container = styled.div`
  padding-top: 80px;
  padding-left: 5%;
  padding-right: 5%;
`

export const Label = styled.p`
  font-size: 15px;
  margin-top: 10px;
  margin-bottom: 5px;
`
export const Field = styled.input`
  font-size: 14px;
  width: 420px;
  padding: 8px 5px 8px 8px;
`

export const LinkButton = styled.button`
  font-size: 18px;
  background-color: #424242;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 5px 15px 5px 15px;
`

export const SendButton = styled.button`
  font-size: 18px;
  background-color: #424242;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 5px 15px 5px 15px;
`

export const SendContainer = styled.div`
  margin-top: 20px;
`

class SimpleValueContainer extends React.Component {
  constructor() {
    super(...arguments)
  }
  componentWillMount() {
    const { result, loading, error } = this.props
    if (!loading && !result && !error) {
      this.props.launchFetch(this.props)
    }
  }
  loading() {
    return <span>Loading...</span>
  }
  render() {
    const { result, loading, error } = this.props
    if (loading && !result) {
      return this.loading()
    }
    if (error) {
      return <tt>{JSON.stringify([error, error.stack], null, 2)}</tt>
    }
    if (result) {
      return this.props.draw(result)
    }
    return <div>loading, error, result</div>
  }
}

export const SimpleValue = (fetchActionCreator, pathCreator, render) => {
  return connect((state, ownProps) => {
    const pathToStatus = pathCreator(ownProps, state)
    const elements = pathToStatus.split('/')
    return Object.assign(
      { draw: render },
      elements.reduce((prev, next) => prev[next], state.generic),
    )
  }, {
    launchFetch: (props) => {
      return (dispatch) => {
        const pathToStatus = pathCreator(props)
        dispatch({ type: 'mark loading ' + pathToStatus })
        fetchActionCreator(props).then(res => res.json())
          .then(result => {
            dispatch({ type: 'set result ' + pathToStatus, payload: result })
          })
          .catch(error => {
            dispatch({ type: 'errored ' + pathToStatus, payload: error })
          })
      }
    }
  })(SimpleValueContainer)
}

export const ApiValue = (pathToData, render) => {
  return SimpleValue(
    props => fetch('/api/' + pathToData + '/' + props.id),
    props => pathToData + '/' + props.id,
    render
  )
}

export const CollectionValue = (pathToData, render) => {
  return SimpleValue(() => fetch('/api/' + pathToData), () => pathToData, render)
}

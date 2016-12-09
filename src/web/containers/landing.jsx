import * as React from 'react'

import { browserHistory } from 'react-router'
import { Card, Col, Row } from 'antd'
import { Link } from 'react-router'
import { default as styled } from 'styled-components'

const Cover = styled.section`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  text-align: center;
  background-color: white;
`

const Title = styled.h1`
  margin-bottom: 20px;
`
const Page = styled.div`
  background-color: #333;
`
const Search = styled.div`
  flex-grow: 1;
  align-self: center;
`
const SearchInput = styled.input`
  margin: 20px;
  font-size: 16px;
  width: 261px;
  height:: 40px;
  margin: auto;
  margin-bottom: 20px;
  display: block;
  align-self: center;
  padding: 10px 10px 6px 10px;
`

const SearchButton = styled.button`
  display: block;
  width: 100px;
  padding: 10px;
  font-size: 13px;
  border-radius: 5px;
  margin: auto;
  background-color: #333;
  height: 30pxr
  color: white;
`

export class Landing extends React.Component {
  constructor() {
    super(...arguments)
    this.state = {}
    this.handleChange = (ev) => {
      this.setState({[ev.target.name]: ev.target.value})
    }
  }
  search(ev) {
    ev.preventDefault()
    browserHistory.push('/search?q=' + this.state.q)
  }
  render() {
    return (<Page>
      <Cover>
        <Search>
          <Title>Poet</Title>
          <form onSubmit={this.search.bind(this)}>
            <SearchInput onChange={this.handleChange} name='q' />
            <SearchButton>Search</SearchButton>
          </form>
        </Search>
      </Cover>
    </Page>)
  }
}
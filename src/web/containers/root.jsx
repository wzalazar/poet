import * as React from 'react'

import { Menu, Anchor } from 'antd'
import { browserHistory } from 'react-router'

const SubMenu = Menu.SubMenu

export class Root extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = { selected: 'landing' }
  }

  select({ key }) {
    browserHistory.push('/' + (key === 'landing' ? '' : key))
    this.setState({ selected: key })
  }

  render() {
    return (<div className="root">
      <Anchor>
        <Menu mode="horizontal"
            style={{ position: 'absolute', top: 0, width: '100%' }}
            onSelect={this.select.bind(this)}
            selectedKeys={[this.state.selected]} >
          <Menu.Item key='landing' >Poet</Menu.Item>
          <Menu.Item key='explorer'>Explorer</Menu.Item>
          <Menu.Item key='portfolio'>Portfolio</Menu.Item>
          <Menu.Item key='settings'>Settings</Menu.Item>
        </Menu>
      </Anchor>
      { this.props.children }
    </div>)
  }
}
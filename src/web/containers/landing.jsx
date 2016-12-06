import * as React from 'react'

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
  flex: 1;
  align-self: center;
`

const ExplainSection = styled.section`
`

const Page = styled.div`
  background-color: #333;
`

const AboutSection = styled.section`
  padding: 20px;
  background: white;
  font-size: 16px;
  flex: 1;
`

export class Landing extends React.Component {
  render() {
    return (<Page>
      <Cover>
        <Title>Poet</Title>
      </Cover>
      <ExplainSection>
        <Row>
          <Col span="8" style={{ padding: "20px" }}>
            <Card title="Card title" bordered={false}>Card content</Card>
          </Col>
          <Col span="8" style={{ padding: "20px" }}>
            <Card title="Card title" bordered={false}>Card content</Card>
          </Col>
          <Col span="8" style={{ padding: "20px" }}>
            <Card title="Card title" bordered={false}>Card content</Card>
          </Col>
        </Row>
      </ExplainSection>
      <AboutSection>
        <h2>Loren ipsum</h2>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin eleifend bibendum posuere. Donec metus turpis, egestas in suscipit faucibus, ornare eu arcu. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Nullam iaculis ante erat, a interdum ipsum malesuada in. Pellentesque hendrerit commodo eros, at vestibulum enim tristique et. Donec congue vulputate urna vitae pretium. Nulla quis felis lorem. Vestibulum sit amet pulvinar ligula, a tristique lectus. Fusce iaculis sit amet nulla eu lacinia. Curabitur sit amet leo nec quam fermentum ornare. Cras sit amet facilisis eros. Quisque non tempor dui. In at ante consectetur, egestas dui at, condimentum velit. Vivamus pellentesque lorem nibh, at scelerisque ligula porta in.</p>

        <p>Proin sit amet est vestibulum, dignissim eros eu, porttitor velit. Praesent nec nunc et ex sollicitudin malesuada vitae at nibh. Nulla a efficitur libero. Vivamus a aliquam orci. Nulla lectus mi, cursus nec rutrum ac, posuere eget leo. Integer vel scelerisque elit. Duis sed posuere velit, eget dignissim nibh. Donec sed turpis orci. Nullam porttitor orci et semper finibus. Donec elementum placerat arcu, sed dictum est porttitor non. Donec venenatis et augue pulvinar sollicitudin. Donec eu finibus mi, et suscipit tellus. Maecenas ut aliquam lectus.</p>

        <p>In nunc elit, imperdiet id justo nec, tristique luctus magna. Mauris luctus, magna eget lobortis viverra, ante felis scelerisque nisi, eget dictum ex arcu et orci. Sed interdum pulvinar velit sit amet accumsan. Mauris in quam vestibulum, ultrices massa sed, viverra nunc. Proin ac ullamcorper felis, eu vulputate justo. Sed dapibus erat ipsum. Pellentesque in magna a nibh posuere finibus. Cras sollicitudin arcu erat, nec luctus mauris finibus ac. Donec facilisis nibh urna, et congue orci iaculis sollicitudin. Cras condimentum, mauris non rhoncus faucibus, odio enim hendrerit neque, ultrices facilisis dui ipsum nec elit. Sed ultrices eros at tortor lacinia, sed dictum velit mollis. Praesent in tristique lacus, sed cursus nunc. Aliquam erat volutpat. Morbi id velit ornare, egestas dolor a, posuere magna. Suspendisse tempor ac mi in vulputate. Phasellus molestie sollicitudin sapien, id pulvinar justo mattis vel.</p>
      </AboutSection>
    </Page>)
  }
}
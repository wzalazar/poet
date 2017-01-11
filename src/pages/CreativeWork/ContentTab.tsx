import * as React from 'react';

import CreativeWorkComponent, { CreativeWorkProps } from '../../components/CreativeWorkComponent';

function render(props: CreativeWorkProps): JSX.Element {
  return (
    <div className="contentTab">
      <h1>Content</h1>
      <div>Id: {props.id}</div>
      <div>publicKey: {props.publicKey}</div>
    </div>
  )
}

export default CreativeWorkComponent(render);
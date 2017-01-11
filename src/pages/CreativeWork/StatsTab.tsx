import * as React from 'react';

import CreativeWorkComponent, { CreativeWorkProps } from '../../components/CreativeWorkComponent';

function render(props: CreativeWorkProps): JSX.Element {
  return (
    <div className="statsTab">
      <h1>Stats</h1>
    </div>
  )
}

export default CreativeWorkComponent(render);
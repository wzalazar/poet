import * as React from 'react';

import CreativeWorkComponent, { CreativeWorkProps } from '../../components/CreativeWorkComponent';

function render(props: CreativeWorkProps): JSX.Element {
  return (
    <div className="historyTab">
      <h1>History</h1>
    </div>
  )
}

export default CreativeWorkComponent(render);
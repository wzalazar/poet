import * as React from 'react';

import WorkComponent, { WorkProps } from '../../hocs/WorkComponent';

function render(props: WorkProps): JSX.Element {
  return (
    <div className="statsTab">
      <h1>Stats</h1>
    </div>
  )
}

export default WorkComponent(render);
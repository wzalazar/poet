import * as React from 'react';

import WorkComponent, { WorkProps } from '../../components/WorkComponent';

function render(props: WorkProps): JSX.Element {
  return (
    <div className="historyTab">
      <h1>History</h1>
    </div>
  )
}

export default WorkComponent(render);
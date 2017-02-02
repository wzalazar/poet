import * as React from 'react';

import WorkComponent, { WorkProps } from '../../hocs/WorkComponent';

function render(props: WorkProps): JSX.Element {
  return (
    <div className="technicalTab">
      <h1>Technical</h1>
    </div>
  )
}

export default WorkComponent(render);
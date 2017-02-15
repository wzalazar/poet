import * as React from 'react';

import WorkComponent from '../../hocs/WorkComponent';
import { Work } from '../../atoms/Interfaces';

function render(props: Work): JSX.Element {
  return (
    <div className="statsTab">
      <h1>Stats</h1>
    </div>
  )
}

export default WorkComponent(render);
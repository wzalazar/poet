import * as React from 'react';

import WorkComponent from '../../hocs/WorkComponent';
import { Work } from '../../atoms/Interfaces';

function render(props: Work): JSX.Element {
  return (
    <div className="historyTab">
      <h1>History</h1>
    </div>
  )
}

export default WorkComponent(render);
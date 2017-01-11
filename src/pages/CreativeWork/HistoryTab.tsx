import * as React from 'react';

import ClaimComponent, { ClaimProps } from '../../components/ClaimComponent';

function render(props: ClaimProps): JSX.Element {
  return (
    <div className="historyTab">
      <h1>History</h1>
    </div>
  )
}

export default ClaimComponent(render);
import * as React from 'react';

import ClaimComponent, { ClaimProps } from '../../components/ClaimComponent';

function render(props: ClaimProps): JSX.Element {
  return (
    <div className="statsTab">
      <h1>Stats</h1>
    </div>
  )
}

export default ClaimComponent(render);
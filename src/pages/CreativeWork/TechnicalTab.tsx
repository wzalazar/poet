import * as React from 'react';

import ClaimComponent, { ClaimProps } from '../../components/ClaimComponent';

function render(props: ClaimProps): JSX.Element {
  return (
    <div className="technicalTab">
      <h1>Technical</h1>
    </div>
  )
}

export default ClaimComponent(render);
import * as React from "react";

import ClaimComponent, { ClaimProps } from '../../components/ClaimComponent';

function render(props: ClaimProps): JSX.Element {
  return (
    <div className="contentTab">
      <h1>Content</h1>
      <div>Id: {props.id}</div>
      <div>publicKey: {props.publicKey}</div>
    </div>
  )
}

export default ClaimComponent(render);
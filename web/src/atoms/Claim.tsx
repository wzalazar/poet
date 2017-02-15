import * as React from 'react';

import { ClaimInfo } from "./Interfaces";
import moment = require('moment');

export function TimeElapsedSinceTimestamp(props: { claimInfo: ClaimInfo }) {
  const createdAt = props.claimInfo
    && props.claimInfo.timestamp
  return (<span>{
    createdAt
      ? moment(createdAt).fromNow()
      : '(unconfirmed)'
  }</span>)
}

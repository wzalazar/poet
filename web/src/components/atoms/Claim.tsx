import * as React from 'react';

import { ClaimInfo } from "../../Interfaces";
import moment = require('moment');
import { timeFrom } from './Work';

export function TimeElapsedSinceTimestamp(props: { claimInfo: ClaimInfo }) {
  const createdAt = props.claimInfo
    && props.claimInfo.timestamp
  return (<span>{
    createdAt
      ? timeFrom(createdAt)
      : '(unconfirmed)'
  }</span>)
}

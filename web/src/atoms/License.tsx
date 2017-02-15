import * as React from 'react';
import { License } from './Interfaces';
import moment = require('moment');
import { Config } from '../config';
import { WorkNameById } from './Work';


export function TimeSinceIssueDate(props: { license: License }) {
  const issueDate = props.license
    && props.license.attributes
    && props.license.attributes.issueDate
  return (<span>{
    issueDate
      ? moment(issueDate).format(Config.dateFormat)
      : '(unknown publication date)'
  }</span>)
}

export function ReferencedWorkName(props: { license: License }) {
  return <WorkNameById workId={props.license.attributes.reference} />
}

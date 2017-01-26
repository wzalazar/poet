import * as React from 'react';
import { Link } from 'react-router';
import * as moment from 'moment';

import { FetchComponentProps } from '../../hocs/FetchComponent';
import ProfileLink from '../../components/ProfileLink';

import Pagination from '../../components/Pagination';
import WorksComponent from '../../hocs/Works';
import { WorkProps } from '../../hocs/WorkComponent';

import './Layout.scss';

function renderWork(props: WorkProps) {
  return (
    <li key={props.id} className="mb-3">
      <h3><Link to={'/works/' + props.id}>{props.attributes.name}</Link></h3>
      <div>by { props.author ? <ProfileLink id={props.author} /> : (props.attributes.author || 'Unknown author') }</div>
      <small>
        <span>Created: { moment(props.attributes.publishedAt || props.attributes.createdAt ).fromNow() }</span>
        <span className="ml-3">Timestamped: { moment(props.claimInfo && props.claimInfo.timestamp).fromNow() }</span>
      </small>
      <div>{props.attributes.content}</div>
    </li>
  )
}

function render(props: FetchComponentProps) {
  return (
    <div className="works-results">
      <h4 className="mb-3 showing-results">Showing {props.elements.length} results</h4>
      <ul className="list-unstyled">
        { props.elements.map(renderWork) }
      </ul>
      <Pagination />
    </div>
  )
}

export default WorksComponent(render);
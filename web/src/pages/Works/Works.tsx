import * as React from 'react';
import { Link } from 'react-router';
import * as moment from 'moment';

import { FetchComponentProps } from '../../hocs/FetchComponent';
import ProfileLink from '../../components/ProfileLink';

import Pagination from '../../components/Pagination';
import WorksComponent from '../../hocs/Works';
import { WorkProps } from '../../hocs/WorkComponent';

import './Works.scss';

function renderWork(props: WorkProps) {
  return (
    <li key={props.id} className="mb-3">
      <h3><Link to={'/works/' + props.id}>{props.attributes.name}</Link></h3>
      <div>
        <span className="timestamp"><strong>Timestamped</strong> { moment(props.claimInfo && props.claimInfo.timestamp).fromNow() }</span>&nbsp;
        <span className="author">by { props.attributes.authorPublicKey ? <ProfileLink id={props.attributes.authorPublicKey} /> : (props.attributes.authorDisplayName || 'Unknown author') }</span>
      </div>
      <div className="content">{props.attributes.content}</div>
    </li>
  )
}

function render(props: FetchComponentProps) {
  return (
    <section className="works-results container">
      <h4 className="showing-results">Showing {props.elements.length} Results</h4>
      <ul className="list-unstyled">
        { props.elements.map(renderWork) }
      </ul>
      <Pagination />
    </section>
  )
}

export default WorksComponent(render);
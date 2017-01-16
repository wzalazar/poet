import * as React from 'react';
import { Link } from 'react-router';

import { FetchComponentProps } from '../../components/FetchComponent';
import ProfileLink from '../../components/ProfileLink';

import WorksComponent from '../../components/Works';
import { WorkProps } from '../../components/WorkComponent';

import './Layout.scss';

function renderWork(props: WorkProps) {
  return (
    <li key={props.id}>
      <h3><Link to={'/works/' + props.id}>{props.name}</Link></h3>
      <div>by <ProfileLink id={props.author} /></div>
      <small><span>Created: {props.published}</span> <span className="ml-3">Timestampted: {props.published}</span></small>
      <div>{props.content}</div>
    </li>
  )
}

function render(props: FetchComponentProps) {
  return (
    <div className="works-results">
      <ul>
        { props.elements.map(renderWork) }
      </ul>
    </div>
  )
}

export default WorksComponent(render);
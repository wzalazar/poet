import * as React from 'react';

import { FetchComponentProps } from '../../hocs/FetchComponent';
import Pagination from '../../components/Pagination';

import WorksComponent from '../../hocs/Works';
import './Works.scss';

import { Work } from '../../atoms/Interfaces';
import { WorkNameWithLink, AuthorWithLink } from '../../atoms/Work';
import { TimeElapsedSinceTimestamp } from '../../atoms/Claim';

function renderWork(props: Work) {
  return (
    <li key={props.id} className="mb-3">
      <div className="name"><WorkNameWithLink work={props} /></div>
      <div className="info">
        <span className="timestamp">Timestamped <TimeElapsedSinceTimestamp claimInfo={props.claimInfo} /></span>
        <span className="author">by <AuthorWithLink work={props}/> </span>
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
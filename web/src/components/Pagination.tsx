import * as React from 'react';;
import { Link } from 'react-router';

// TODO: harcoded link to /works?page=... pass url as prop

export default class Pagination extends React.Component<undefined, undefined> {
  render() {
    return (
      <nav>
        <ul className="pagination">
          { [...Array(10).keys()].map(i => <li key={i} className="page-item"><Link className="page-link" to={'works?page=' + i}>{i+1}</Link></li>)}
        </ul>
      </nav>
    );
  }
}
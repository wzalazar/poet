import * as React from "react";
import { Link } from 'react-router';

import './style.scss';

export interface LandingProps {
}

export class LandingLayout extends React.Component<LandingProps, undefined> {
  render() {
    return (
      <div className="landing">
        <h1>Poet</h1>
        <h2>Copyright management meets the blockchain</h2>

        <div className="search">
          <Link to="/claim/1">Sample claim</Link>
        </div>
      </div>
    )
  }
}

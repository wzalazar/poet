import * as React from 'react';
import { Link } from 'react-router';

import { Images } from '../images/Images';

import './Footer.scss';

export class Footer extends React.Component<undefined, undefined> {
  render() {
    return (
      <footer>
        <div className="container">
          <div className="links-and-address">
            <ul className="links">
              <li>
                <h1>Network</h1>
                <ul>
                  <li><Link to="/network/about/" >About</Link></li>
                  <li><Link to="/network/features" >Features</Link></li>
                  <li><Link to="/network/integrations" >Integrations</Link></li>
                  <li><Link to="/network/use-cases" >Use Cases</Link></li>
                </ul>
              </li>
              <li>
                <h1>Documentation</h1>
                <ul>
                  <li><Link to="/documentation/overview" >Overview</Link></li>
                  <li><Link to="/documentation/developer" >Developer</Link></li>
                  <li><Link to="/documentation/integrations" >Integrations</Link></li>
                </ul>
              </li>
              <li>
                <h1>Company</h1>
                <ul>
                  <li><Link to="/company/blog" >Blog</Link></li>
                  <li><Link to="/company/team" >Team</Link></li>
                  <li><Link to="/company/roadmap" >Roadmap</Link></li>
                  <li><Link to="/company/contact" >Contact</Link></li>
                </ul>
              </li>
            </ul>
            <address>
              209 10th Ave. S <br/>
              Nashville, TN 37203
            </address>
          </div>
          <div className="logo-and-social">
            <img src={Images.InvertedLogo} />
            <div className="social">
              <img src={Images.Twitter} />
              <img src={Images.Github} />
              <img src={Images.Reddit} />
              <img src={Images.Slack} />
            </div>
          </div>
        </div>
      </footer>
    )
  }
}
import * as React from 'react';

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
                  <li>About</li>
                  <li>Features</li>
                  <li>Integrations</li>
                  <li>Use Cases</li>
                </ul>
              </li>
              <li>
                <h1>Documentation</h1>
                <ul>
                  <li>Overview</li>
                  <li>Developer</li>
                  <li>Integrations</li>
                </ul>
              </li>
              <li>
                <h1>Company</h1>
                <ul>
                  <li>Blog</li>
                  <li>Team</li>
                  <li>Roadmap</li>
                  <li>Contact</li>
                </ul>
              </li>
            </ul>
            <address>
              1234 Address Road <br/>
              Simcity, World 00000 <br/>
              +1 (000) 000 -0000
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
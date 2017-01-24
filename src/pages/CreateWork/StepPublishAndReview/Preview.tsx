import * as React from 'react';

export interface PreviewProps {
  readonly className?: string;
}

export class Preview extends React.Component<PreviewProps, undefined> {
  render() {
    return (
      <section className={this.props.className} >
        <section>
          <div className="text-center mb-2">
            <h5>Title of Ownership</h5>
            <div>by Satoshi Nakamoto</div>
          </div>
          <table>
            <tbody>
              <tr>
                <td>Media Type</td>
                <td>News Article</td>
              </tr>
              <tr>
                <td>Owner Name</td>
                <td>Satoshi Nakamoto</td>
              </tr>
              <tr>
                <td>Notarized at</td>
                <td>{new Date().toISOString()}</td>
              </tr>
            </tbody>
          </table>
        </section>
        <hr/>
        <section>
          <h5>Title of Creative Work</h5>
          <table>
            <tbody>
              <tr>
                <td>Word Count</td>
                <td>14,104</td>
              </tr>
              <tr>
                <td>Tags</td>
                <td>
                  <span className="badge badge-primary">Primary</span>
                  <span className="badge badge-success">Success</span>
                  <span className="badge badge-info">Info</span>
                </td>
              </tr>
              <tr>
                <td>Notarized at</td>
                <td>{new Date().toISOString()}</td>
              </tr>
            </tbody>
          </table>
        </section>
        <hr/>
        <section>
          <div className="row mb-2">
            <div className="col-sm-6"><h5>MIT License</h5></div>
            <div className="col-sm-6 text-right"><h5>$0.00 USD</h5></div>
          </div>
          <p>
            Permission is hereby granted, free of charge, to any person obtaining a copy
            of this software and associated documentation files (the "Software"), to deal
            in the Software without restriction, including without limitation the rights
            to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
            copies of the Software, and to permit persons to whom the Software is
            furnished to do so, subject to the following conditions:
          </p>
        </section>
        <hr/>
        <section>
          <h5>Notary</h5>
          <table>
            <tbody>
            <tr>
              <td>Status</td>
              <td>Pending</td>
            </tr>
            <tr>
              <td>Notary</td>
              <td>PoetNotary141</td>
            </tr>
            <tr>
              <td>Estimated</td>
              <td>5 minutes</td>
            </tr>
            </tbody>
          </table>
        </section>
      </section>
    );
  }
}
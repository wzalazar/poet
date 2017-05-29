import * as React from 'react';
import { Work } from 'poet-js';

import { WorkById } from '../../../components/atoms/Work';

import './ContentTab.scss';

export class ContentTab extends WorkById {

  renderElement(work?: Work) {
    return (
      <section className="content-tab">
        <section className="attributes">
          <table>
            <tbody>
            {
              work && Object.entries(work.attributes).filter(([key, value]) => key !== 'content').map(([key, value]) => (
                <tr key={key}>
                  <td>{key}</td>
                  <td>{value}</td>
                </tr>
              ))
            }
            </tbody>
          </table>
        </section>
        <section className="content">{ work && work.attributes.content }</section>
      </section>
    )
  }

  renderLoading() {
    return this.renderElement();
  }

}
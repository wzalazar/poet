import * as React from 'react';
import { Work } from 'poet-js';

import { WorkById } from '../../../components/atoms/Work';

import './ContentTab.scss';
import * as moment from 'moment';
import { Configuration } from '../../../configuration'

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
                  <td>{key === 'datePublished' || key === 'dateCreated' || key === 'dateSubmitted' ? moment(parseInt(value)).format(Configuration.dateTimeFormat) : value}</td>
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
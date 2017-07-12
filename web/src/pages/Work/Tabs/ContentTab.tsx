import * as React from 'react';
import * as moment from 'moment'

import { Work } from 'poet-js';
import { WorkById } from '../../../components/atoms/Work';
import { Configuration } from '../../../configuration'
import './ContentTab.scss';

export class ContentTab extends WorkById {

  private formatUnixDate(unixDate: string) {
    return moment(parseInt(unixDate)).format(Configuration.dateTimeFormat)
  }

  private renderItem(attribute: string[]) {
    return (
      <tr key={attribute[0]}>
        <td>{attribute[0]}</td>
        <td>{ attribute[0].startsWith('date') ? moment(parseInt(attribute[1])).format(Configuration.dateTimeFormat) : attribute[1]}</td>
      </tr>
    )
  }

  renderElement(work?: Work) {
    return (
      <section className="content-tab">
        <section className="attributes">
          <table>
            <tbody>
            {
              work && Object.entries(work.attributes).filter(([key, value]) => key !== 'content').map(this.renderItem)
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
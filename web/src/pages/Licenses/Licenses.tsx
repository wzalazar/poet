import * as React from 'react';

import { DropdownMenu } from '../../components/DropdownMenu';
import { ResourceProvider } from '../../components/ResourceProvider';

import './Layout.scss';

import Config from '../../config';

import '../../extensions/String';
import { OwnerName, WorkNameById } from '../../atoms/Work';
import { License } from '../../atoms/Interfaces';
import { TimeSinceIssueDate, ReferencedWorkName } from '../../atoms/License';
import { OfferingType } from '../../atoms/Offering';

type LicensesResource = ReadonlyArray<License>;

export interface LicensesProps {
  readonly publicKey?: string;
  readonly limit?: number;
  readonly showActions?: boolean;
}

export default class Licenses extends ResourceProvider<LicensesResource, LicensesProps, undefined> {
  static defaultProps: LicensesProps = {
    limit: 100,
    showActions: false
  };

  renderElement(licenses: LicensesResource) {
    return licenses ? this.renderLicenses(licenses) : this.renderNoLicenses();
  }

  resourceLocator() {
    const limit = `limit=${this.props.limit}`
    const holder = `holder=${this.props.publicKey}`
    return { url: `${Config.api.explorer}/licenses?${limit}&${holder}` }
  }

  private renderLicenses(licenses: LicensesResource) {
    return (
      <section className="licenses">
        <ul className="row list-unstyled">
          { licenses.map(license => this.renderLicense(license)) }
        </ul>
      </section>
    )
  }

  private renderNoLicenses() {
    return (
      <section className="licenses">
        <div>This user doesn't have any licenses yet!</div>
      </section>
    )
  }

  private renderLicense(license: License) {
    return (
      <li key={license.id} className="card col-sm-5 col-sm-3 col-lg-3 m-1">
        <div className="card-block">
          <div className="card-title " >
            <h5><ReferencedWorkName license={license} /></h5>
            { this.props.showActions && <div className="menu">
              <DropdownMenu options={['Revoke']} onOptionSelected={this.optionSelected.bind(this, license)}>
                Actions
              </DropdownMenu>
            </div> }
          </div>
          <div>
            <div className="box-placeholder" />
            <div>
              <div><OfferingType offering={license.referenceOffering} /></div>
              <div><TimeSinceIssueDate license={license} /></div>
            </div>
          </div>
          <div>Owned by: <OwnerName workId={ license.reference.id }/></div>
        </div>
      </li>
    )
  }

  private optionSelected(license: any, option: string) {
    console.log('optionSelected', license, option);
  }

}
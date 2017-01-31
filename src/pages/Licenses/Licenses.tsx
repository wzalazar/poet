import * as React from 'react';

import { DropdownMenu } from '../../components/DropdownMenu';
import { ResourceProvider } from '../../components/ResourceProvider';

import './Layout.scss';

import Config from '../../config';

import '../../extensions/String';

type LicensesResource = ReadonlyArray<License>;

export interface License {
  readonly id: string;
  readonly publicKey: string;
  readonly title: string;
  readonly licenseType: string;
  readonly owner: string;
  readonly issueDate: string;

  readonly reference: {
    readonly owner: {
      readonly id: string;
    }
    readonly attributes: {
      readonly name: string;
    }
  }

  readonly licenseHolder: {
    readonly attributes: {
      readonly name: string;
    }
  }
}

export interface LicensesProps {
  readonly publicKey?: string;
  readonly limit?: number;
}

export default class Licenses extends ResourceProvider<LicensesResource, LicensesProps, undefined> {
  static defaultProps: LicensesProps = {
    limit: 5
  };

  renderElement(licenses: LicensesResource) {
    return licenses ? this.renderLicenses(licenses) : this.renderNoLicenses();
  }

  resourceLocator() {
    return { url: `${Config.api.explorer}/licenses?limit=${this.props.limit}` }
  }

  private renderLicenses(licenses: LicensesResource) {
    return (
      <section className="licenses">
        <ul className="row list-unstyled">
          { licenses.map(this.renderLicense.bind(this)) }
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
            <h5>{ license.reference.attributes.name }</h5>
            <div className="menu">
              <DropdownMenu options={['Edit', 'Transfer', 'Revoke']} optionSelected={this.optionSelected.bind(this, license)}>
                Actions
              </DropdownMenu>
            </div>
          </div>
          <div>
            <div className="box-placeholder" />
            <div>
              <div>{ license.licenseType }</div>
              <div>{ license.licenseHolder && license.licenseHolder.attributes && license.licenseHolder.attributes.name }</div>
              <div>{ license.issueDate && new Date(license.issueDate).toISOString() }</div>
            </div>
          </div>
          <div>{ license.publicKey.firstAndLastCharacters(6) }</div>
        </div>
      </li>
    )
  }

  private optionSelected(license: any, option: string) {
    console.log('optionSelected', license, option);
  }

}
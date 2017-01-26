import * as React from 'react';
import { Link } from 'react-router';

import { Licenses, LicensesProps } from '../../hocs/Licenses';
import { DropdownMenu } from '../../components/DropdownMenu';

import './Layout.scss';

function renderLicense(license: any) {
  return (
    <li key={license.key} className="card col-sm-5 col-sm-3 col-lg-3 m-1">
      <div className="card-block">
        <div className="card-title " >
          <h5>{ license.title }</h5>
          <div className="menu">
            <DropdownMenu options={['Edit', 'Transfer', 'Revoke']} optionSelected={optionSelected.bind(null, license)}>
              Actions
            </DropdownMenu>
          </div>
        </div>
        <div>
          <div className="box-placeholder" />
          <div>
            <div>{ license.licenseType }</div>
            <div>{ license.owner }</div>
            <div>{ new Date(license.issueDate).toISOString() }</div>
          </div>
        </div>
        <div>{ license.key }</div>
      </div>
    </li>
  )
}

function optionSelected(license: any, option: string) {
  console.log('optionSelected', license, option);
}

function renderLicenses(props: LicensesProps) {
  return (
    <section className="licenses">
      <ul className="row list-unstyled">
        { props.licenses.map(renderLicense) }
      </ul>
    </section>
  )
}

function renderNoLicenses() {
  return (
    <section className="licenses">
      <div>This user doesn't have any licenses yet!</div>
    </section>
  )
}

function render(props: LicensesProps) {
  return props.licenses ? renderLicenses(props) : renderNoLicenses();
}

export default Licenses(render);
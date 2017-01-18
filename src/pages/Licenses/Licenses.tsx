import * as React from 'react';
import { Link } from 'react-router';

import { FetchComponentProps } from '../../components/FetchComponent';
import Licenses from '../../components/Licenses';
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

function render(props: FetchComponentProps) {
  return (
    <section className="licenses">
      <ul className="row list-unstyled">
        { props.elements.map(renderLicense) }
      </ul>
    </section>
  )
}

export default Licenses(render);
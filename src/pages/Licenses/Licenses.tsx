import * as React from 'react';
import { Link } from 'react-router';

import { FetchComponentProps } from '../../components/FetchComponent';
import WorksComponent from '../../components/Works';
import { WorkProps } from '../../components/WorkComponent';

//import './Layout.scss';

const mockLicenses = [
  {
    title: "Title of Work",
    owner: "bitcoin-magazine",
    licenseType: "Attribution License",
    issueDate: 3847209345,
    key: "204jrwodnfoaidn023rnoenl1"
  },
  {
    title: "Title of Work",
    owner: "bitcoin-magazine",
    licenseType: "Attribution License",
    issueDate: 3847209345,
    key: "204jrwodnfoaidn023rnoenl2"
  },
  {
    title: "Title of Work",
    owner: "bitcoin-magazine",
    licenseType: "Attribution License",
    issueDate: 3847209345,
    key: "204jrwodnfoaidn023rnoenl3"
  },
  {
    title: "Title of Work",
    owner: "bitcoin-magazine",
    licenseType: "Attribution License",
    issueDate: 3847209345,
    key: "204jrwodnfoaidn023rnoenl4"
  },
  {
    title: "Title of Work",
    owner: "bitcoin-magazine",
    licenseType: "Attribution License",
    issueDate: 3847209345,
    key: "204jrwodnfoaidn023rnoenl5"
  }
];

function renderLicense(license: any) {
  return (
    <li key={license.key} className="card col-sm-6 col-sm-4 col-lg-3 m-1">
      <div className="card-block">
        <h5 className="card-title">{ license.title }</h5>
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

function render(props: WorkProps) {
  return (
    <section className="portfolio-works">
      <ul className="row list-unstyled">
        { mockLicenses.map(renderLicense) }
      </ul>
    </section>
  )
}

export default WorksComponent(render);
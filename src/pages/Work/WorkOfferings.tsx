import * as React from 'react';

import WorkComponent, { WorkProps, WorkOffering } from '../../hocs/WorkComponent';

import './WorkOfferings.scss';

function renderLicense(license: any): JSX.Element {
  return (
    <section className="license" key={license.id}>
      <div className="publisher">{ license.publisher }</div>
      <div className="url"><a href={ license.url } target="_blank">{ license.url }</a></div>
    </section>
  )
}

function renderLicenses(licenses: ReadonlyArray<any>) {
  return (
    <section className="licenses">
      <h3>Publishers with this license </h3>
      { licenses.map(renderLicense) }
    </section>
  )
}

function renderOffering(workOffering: WorkOffering): JSX.Element {
  return (
    <section className="offering" key={workOffering.id} >
      <h3>License</h3>
      <div className="info">
        <div className="row mb-2">
          <div className="description col-xs-7">
            { workOffering.attributes.description || 'This offering lacks a description. Please contact the author.' }
          </div>
          <div className="col-xs-5">
            <div className="price">
              { workOffering.attributes.pricingPriceAmount || 0 }
              { workOffering.attributes.pricingPriceCurrency || 'BTC' }
            </div>
            <div className="type">
              { workOffering.attributes.type }
            </div>
          </div>
        </div>
        <div className="text-center">
          <button className="btn btn-primary">Purchase License</button>
        </div>
      </div>
      { workOffering.licenses && renderLicenses(workOffering.licenses) }
    </section>
  );
}

function render(props: WorkProps): JSX.Element {
  return (
    <section className="offerings">
      { props.offerings.map(renderOffering) }
    </section>
  )
}

export default WorkComponent(render);
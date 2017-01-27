import * as React from 'react';
import { connect } from 'react-redux';

import WorkComponent, { WorkProps, WorkOffering } from '../../hocs/WorkComponent';

import './WorkOfferings.scss';
import Actions from '../../actions'

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

interface SubmitOffering {
  purchase: any
}

function renderOfferingFunc(workOffering: WorkOffering & SubmitOffering): JSX.Element {
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
          <button className="btn btn-primary" onClick={() => workOffering.purchase({
            id: workOffering.id,
            attributes: workOffering.attributes
          })}>Purchase License</button>
        </div>
      </div>
      { workOffering.licenses && renderLicenses(workOffering.licenses) }
    </section>
  );
}

const RenderOffering = connect((e: any) => e, {
  purchase: (offering: any) => ({
    type: Actions.signTxSubmitRequested,
    payload: offering
  })
})(renderOfferingFunc) as any;

function render(props: WorkProps): JSX.Element {
  return (
    <section className="offerings">
      { props.offerings.map((offering: any, index: number) => <RenderOffering {...offering} key={index} />) }
    </section>
  )
}

export default WorkComponent(render);
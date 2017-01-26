import * as React from 'react';

import WorkComponent, { WorkProps, WorkOffering } from '../../hocs/WorkComponent';

import './WorkOfferings.scss';

function renderLicense(license: any): JSX.Element {
  return (
    <div className="license" key={license.id}>
      <div className="publisher">{ license.publisher }</div>
      <div className="url"><a href={ license.url } target="_blank">{ license.url }</a></div>
    </div>
  )
}

function renderOffering(workOfferingProps: WorkOffering): JSX.Element {
  return (
    <div key={workOfferingProps.id} className="offering">
      <h3>License</h3>
      <div className="info row">
        <div className="description col-xs-7">
          { workOfferingProps.offeringInfo }
        </div>
        <div className="col-xs-5">
          { workOfferingProps.offeringInfo && workOfferingProps.offeringInfo.price && <div className="price">
            ${ workOfferingProps.offeringInfo.price.amount } { workOfferingProps.offeringInfo.price.currency }
          </div> }
          <div className="type">
            { workOfferingProps.offeringType }
          </div>
        </div>
      </div>

      <div className="licenses">
        <h3>Publishers with this license </h3>
        {/*{ workOfferingProps.licenses.map(renderLicense) }*/}
      </div>
    </div>
  );
}

function render(props: WorkProps): JSX.Element {
  return (
    <div className="offerings">
      { props.offerings.map(renderOffering) }
    </div>
  )
}

export default WorkComponent(render);
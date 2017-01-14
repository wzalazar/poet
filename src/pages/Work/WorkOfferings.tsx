import * as React from 'react';

import WorkOfferingsComponent, { WorkOfferingsProps, WorkOfferingProps } from '../../components/WorkOfferingsComponent';


function renderLicense(license: any): JSX.Element {
  return (
    <div className="license" key={license.id}>
      <div className="publisher">{ license.publisher }</div>
      <div className="url"><a href={ license.url } target="_blank">{ license.url }</a></div>
    </div>
  )
}

function renderOffering(workOfferingProps: WorkOfferingProps): JSX.Element {
  return (
    <div key={workOfferingProps.id} className="offering">
      <h3>License</h3>
      <div className="info row">
        <div className="description col-xs-7">
          { workOfferingProps.description }
        </div>
        <div className="col-xs-5">
          <div className="price">
            ${ workOfferingProps.price.amount } { workOfferingProps.price.currency }
          </div>
          <div className="type">
            { workOfferingProps.type }
          </div>
        </div>
      </div>

      <div className="licenses">
        <h3>Publishers with this license </h3>
        { workOfferingProps.licenses.map(renderLicense) }
      </div>
    </div>
  );
}

function render(props: WorkOfferingsProps): JSX.Element {
  return (
    <div className="offerings">
      { props.elements.map(renderOffering) }
    </div>
  )
}

export default WorkOfferingsComponent(render);
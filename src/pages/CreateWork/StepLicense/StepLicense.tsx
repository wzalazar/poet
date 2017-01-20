import * as React from 'react';

import { RadioButton, RadioButtonGroup } from '../../../components/RadioButtonGroup';

import { Pricing } from './Pricing';
import { LicensePreview } from './LicensePreview';

const licenseTypes = [
  new RadioButton('attribution-only', 'Attribution Only'),
  new RadioButton('pay', 'Pay'),
  new RadioButton('one-off', 'One Off'),
  new RadioButton('pay-to-publish', 'Pay to Publish')
];

export class StepLicense extends React.Component<any, any> {
  render() {
    return (
      <section className="step-2-license">
        <h2>Add a License</h2>
        <div className="row">
          <div className="col-sm-6">
            <h3>License</h3>
            <RadioButtonGroup radioButtons={licenseTypes} className="mb-3" onSelectionChange={console.log} />
            <Pricing />
          </div>
          <LicensePreview className="col-sm-6"/>
        </div>
      </section>
    )
  }
}
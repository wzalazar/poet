import * as React from 'react';

import { RadioButton, RadioButtonGroup } from '../../../components/RadioButtonGroup';

const licenseTypes = [
  new RadioButton('attribution-only', 'Attribution Only'),
  new RadioButton('pay', 'Pay'),
  new RadioButton('one-off', 'One Off'),
  new RadioButton('pay-to-publish', 'Pay to Publish')
];

export class LicenseType extends React.Component<undefined, undefined> {
  private controls: {
    radioButtonGroup?: RadioButtonGroup
  } = {};

  render() {
    return (
      <RadioButtonGroup ref={radioButtonGroup => this.controls.radioButtonGroup = radioButtonGroup} radioButtons={licenseTypes} className="mb-3" />
    )
  }

  public getSelectedLicenseType() {
    return this.controls.radioButtonGroup.getSelectedItem().id;
  }
}
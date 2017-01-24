import * as React from 'react';

import { RadioButton, RadioButtonGroup } from '../../../components/RadioButtonGroup';

export interface LicenseTypeProps {
  readonly onSelectionChange?: (id: string, text: string) => void;
}

export class LicenseType extends React.Component<LicenseTypeProps, undefined> {
  private controls: {
    radioButtonGroup?: RadioButtonGroup
  } = {};
  public readonly licenseTypes: RadioButton[] = [
    new RadioButton('attribution-only', 'Attribution Only'),
    new RadioButton('pay', 'Pay'),
    new RadioButton('one-off', 'One Off'),
    new RadioButton('pay-to-publish', 'Pay to Publish')
  ];

  render() {
    return (
      <RadioButtonGroup
        ref={radioButtonGroup => this.controls.radioButtonGroup = radioButtonGroup}
        radioButtons={this.licenseTypes}
        onSelectionChange={this.props.onSelectionChange}
        className="mb-3" />
    )
  }

  public getSelectedLicenseType() {
    return this.controls.radioButtonGroup.getSelectedItem().id;
  }
}
import * as React from 'react';

import { RadioButton, RadioButtonGroup } from '../../../components/RadioButtonGroup';

const licenseTypes = [
  new RadioButton('attribution-only', 'Attribution Only'),
  new RadioButton('pay', 'Pay'),
  new RadioButton('one-off', 'One Off'),
  new RadioButton('pay-to-publish', 'Pay to Publish')
];

export class LicenseType extends React.Component<undefined, undefined> {
  private readonly REF_RADIO_BUTTON_GROUP = 'REF_RADIO_BUTTON_GROUP';

  render() {
    return (
      <RadioButtonGroup ref={this.REF_RADIO_BUTTON_GROUP} radioButtons={licenseTypes} className="mb-3" />
    )
  }

  public getSelectedLicenseType() {
    return (this.refs[this.REF_RADIO_BUTTON_GROUP] as any).getSelectedItem().id;
  }
}
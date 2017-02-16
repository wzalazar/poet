import * as React from 'react';

import { RadioButton, RadioButtonGroup } from '../../../components/RadioButtonGroup';
import { LicenseType, LicenseTypes } from '../../../common';

export interface LicenseTypeProps {
  readonly onSelectionChange?: (licenseType: LicenseType) => void;
}

export class LicenseTypeComponent extends React.Component<LicenseTypeProps, undefined> {
  private radioButtonGroup: RadioButtonGroup;
  public readonly radioButtons: ReadonlyArray<RadioButton> =
    LicenseTypes.map(licenseType => new RadioButton(licenseType.id, licenseType.name));

  render() {
    return (
      <RadioButtonGroup
        ref={radioButtonGroup => this.radioButtonGroup = radioButtonGroup}
        radioButtons={this.radioButtons}
        onSelectionChange={this.onSelectionChange.bind(this)}
        className="mb-3" />
    )
  }

  public getSelectedLicenseType(): LicenseType {
    return LicenseTypes.find(licenseType => licenseType.id === this.radioButtonGroup.getSelectedItem().id);
  }

  private onSelectionChange(id: string) {
    this.props.onSelectionChange(this.getSelectedLicenseType());
  }
}
import * as React from 'react';
import { LicenseType, LicenseTypes, ClassNameProps } from '../../../common';

export interface LicensePreviewState {
  readonly licenseType?: LicenseType;
}

export class LicensePreview extends React.Component<ClassNameProps, LicensePreviewState> {
  constructor() {
    super(...arguments);
    this.state = {
      licenseType: LicenseTypes[0]
    }
  }

  render() {
    return (
      <section className={this.props.className}>
        <div><h4>Preview</h4></div>
        <div>
          <div>{ this.state.licenseType.name }</div>
          <div>{ this.state.licenseType.description }</div>
        </div>
      </section>
    );
  }

  public setLicenseType(licenseType: LicenseType) {
    this.setState({
      licenseType
    })
  }
}
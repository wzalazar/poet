import * as React from 'react';

import { Pricing, PricingState } from './Pricing';
import { LicensePreview } from './LicensePreview';
import { LicenseTypeComponent } from './LicenseType';
import { LicenseType } from '../../../common';

export interface StepLicenseData {
  readonly licenseType: LicenseType;
  readonly pricing: PricingState;
}

export interface StepLicenseProps {
  readonly onSubmit: (stepRegisterData: StepLicenseData) => void;
}

export class StepLicense extends React.Component<StepLicenseProps, StepLicenseData> {
  private readonly controls: {
    licenseType?: LicenseTypeComponent,
    pricing?: Pricing;
    licensePreview?: LicensePreview;
  } = {};

  render() {
    return (
      <section className="step-2-license">
        <h2>Add a License</h2>
        <div className="row">
          <div className="col-sm-6">
            <h3>License</h3>
            <LicenseTypeComponent
              ref={ licenseType => this.controls.licenseType = licenseType }
              onSelectionChange={this.onLicenseTypeSelectionChange.bind(this)} />
            <Pricing ref={ pricing => this.controls.pricing = pricing } />
          </div>
          <LicensePreview ref={ licensePreview => this.controls.licensePreview = licensePreview } className="col-sm-6"/>
        </div>
        <button className="btn btn-primary" onClick={this.submit.bind(this)}>Next</button>
      </section>
    )
  }

  private submit(): void {
    this.props.onSubmit({
      licenseType: this.controls.licenseType.getSelectedLicenseType(),
      pricing: this.controls.pricing.state
    });
  }

  private onLicenseTypeSelectionChange(licenseType: LicenseType) {
    this.controls.licensePreview.setLicenseType(licenseType);
  }
}
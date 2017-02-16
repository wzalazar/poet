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
  private licenseType: LicenseTypeComponent;
  private pricing: Pricing;
  private licensePreview?: LicensePreview;

  render() {
    return (
      <section className="step-2-license">
        <div className="row">
          <div className="col-sm-6">
            <h2>License</h2>
            <LicenseTypeComponent
              ref={ licenseType => this.licenseType = licenseType }
              onSelectionChange={this.onLicenseTypeSelectionChange.bind(this)} />
            <Pricing ref={ pricing => this.pricing = pricing } />
          </div>
          <LicensePreview ref={ licensePreview => this.licensePreview = licensePreview } className="col-sm-6"/>
        </div>
        <button className="button-primary" onClick={this.submit.bind(this)}>Next</button>
      </section>
    )
  }

  private submit(): void {
    this.props.onSubmit({
      licenseType: this.licenseType.getSelectedLicenseType(),
      pricing: this.pricing.state
    });
  }

  private onLicenseTypeSelectionChange(licenseType: LicenseType) {
    this.licensePreview.setLicenseType(licenseType);
  }
}
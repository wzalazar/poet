import * as React from 'react';

import { Pricing } from './Pricing';
import { LicensePreview } from './LicensePreview';
import { LicenseType } from './LicenseType';

export interface StepLicenseData {
  licenseType: string;
  pricing: any;
}

export interface StepLicenseProps {
  onSubmit: (stepRegisterData: StepLicenseData) => void;
}

export class StepLicense extends React.Component<StepLicenseProps, StepLicenseData> {
  private readonly REF_LICENSE_TYPE = 'licenseType';
  private readonly REF_PRICING = 'pricing';

  render() {
    return (
      <section className="step-2-license">
        <h2>Add a License</h2>
        <div className="row">
          <div className="col-sm-6">
            <h3>License</h3>
            <LicenseType ref={this.REF_LICENSE_TYPE} />
            <Pricing ref={this.REF_PRICING} />
          </div>
          <LicensePreview className="col-sm-6"/>
        </div>
        <button className="btn btn-primary" onClick={this.submit.bind(this)}>Next</button>
      </section>
    )
  }

  private submit(): void {
    this.props.onSubmit({
      licenseType: (this.refs[this.REF_LICENSE_TYPE] as any).getSelectedLicenseType(),
      pricing: (this.refs[this.REF_PRICING] as any).state,
    });
  }
}
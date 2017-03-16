import * as React from 'react';

import * as Common from '../../../common';

import { Pricing } from './Pricing';
import { LicensePreview } from './LicensePreview';
import { LicenseTypeComponent } from './LicenseType';

import './StepLicense.scss'

export interface StepLicenseData {
  readonly licenseType?: Common.LicenseType;
  readonly pricing?: Common.Pricing;
}

export interface StepLicenseProps {
  readonly onSubmit: (stepRegisterData: StepLicenseData) => void;
  readonly skip: () => void;
}

export class StepLicense extends React.Component<StepLicenseProps, StepLicenseData> {

  skip: () => void = () => {
    this.props.skip();
  }
  submit: () => void = () => {
    this.props.onSubmit({
      licenseType: this.state.licenseType,
      pricing: this.state.pricing
    });
  }

  constructor() {
    super(...arguments);
    this.state = {
      licenseType: Common.LicenseTypes[0],
      pricing: {
        price: {
          amount: 0,
          currency: 'BTC'
        },
        frequency: 'oneTime'
      }
    };
  }

  render() {
    return (
      <section className="step-2-license">
        <div className="row">
          <div className="col-sm-6">
            <h2>License</h2>
            <LicenseTypeComponent
              onSelectionChange={licenseType => this.setState({ licenseType })}
              selectedLicenseTypeId={this.state.licenseType.id} />
            <Pricing
              pricing={this.state.pricing}
              onChange={this.onPricingChange.bind(this)}
            />
            <div className="row">
              <div className="col-sm-6">
                <button className="button button-not-important" onClick={this.skip}>skip</button>
              </div>
              <div className="col-sm-6 next-container">
                <button className="button button-primary" onClick={this.submit}>Next</button>
              </div>
            </div>
          </div>
          <LicensePreview licenseType={this.state.licenseType} className="col-sm-6"/>
        </div>
      </section>
    )
  }

  private onPricingChange(pricing: Common.Pricing) {
    this.setState({
      pricing
    })
  }
}
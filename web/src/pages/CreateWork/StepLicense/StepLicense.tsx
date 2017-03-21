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
  readonly onSkip: () => void;
}

export interface StepLicenseState extends StepLicenseData {
  readonly displayErrors?: boolean;
}

export class StepLicense extends React.Component<StepLicenseProps, StepLicenseState> {
  private pricingInput: Pricing;

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
              onChange={this.onPricingChange}
              displayErrors={this.state.displayErrors}
              ref={pricingInput => this.pricingInput = pricingInput}
            />
            <nav>
              <button className="button-secondary" onClick={this.props.onSkip}>skip</button>
              <button className="button-primary" onClick={this.submit}>Next</button>
            </nav>
          </div>
          <LicensePreview licenseType={this.state.licenseType} className="col-sm-6"/>
        </div>
      </section>
    )
  }

  private onPricingChange = (pricing: Common.Pricing) => {
    this.setState({
      pricing
    })
  };

  private submit: () => void = () => {
    if (!this.state.pricing || !this.state.pricing.price || !this.state.pricing.price.amount || this.state.pricing.price.amount < 0) {
      this.setState({ displayErrors: true });
      this.pricingInput && this.pricingInput.focus();
      return;
    }

    this.props.onSubmit({
      licenseType: this.state.licenseType,
      pricing: this.state.pricing
    });
  };

}
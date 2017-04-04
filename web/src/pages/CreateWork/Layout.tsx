import * as React from 'react'

import { publicKeyToAddress } from '../../bitcoin/addressHelpers'

import { StepRegister, StepRegisterData } from './StepRegister/StepRegister'
import { StepLicense, StepLicenseData } from './StepLicense/StepLicense'
import StepPublishAndReview from './StepPublishAndReview/StepPublishAndReview'
import { CurrentStep } from './CurrentStep';

import './Layout.scss';

interface CreateWorkProps {
  readonly createWorkRequested: (claims: any[]) => any // Actions.claimsSubmitRequested
  readonly userName?: string;
  readonly userPublicKey: string;
}

interface CreateWorkLayoutState {
  readonly selectedStep: number;
  readonly licenseData?: StepLicenseData;
  readonly workData?: StepRegisterData;
  readonly workTitle?: string;
}

export class CreateWorkLayout extends React.Component<CreateWorkProps, CreateWorkLayoutState> {
  private readonly StepNames: ReadonlyArray<string> = ['Register a Work', 'Add a License', 'Preview and Publish'];

  constructor() {
    super(...arguments);
    this.state = {
      selectedStep: 0
    }
  }

  render() {
    return (
      <section className="container create-work">
        <header>
          <h1>{ this.StepNames[this.state.selectedStep] }</h1>
          <CurrentStep
            selectedStep={this.state.selectedStep}
            className="current-step"
          />
        </header>
        { this.state.selectedStep === 0 && <StepRegister onSubmit={this.onStepRegisterSubmit} /> }
        { this.state.selectedStep === 1 && <StepLicense onSubmit={this.onStepLicenseSubmit} onSkip={this.onStepLicenseSkip} /> }
        { this.state.selectedStep === 2 &&
          <StepPublishAndReview
            workTitle={this.state.workTitle}
            price={this.state.licenseData && this.state.licenseData.pricing.price}
            contentHash={this.getContentHash()}
            wordCount={this.getWordCount()}
            onSubmit={this.submitWork.bind(this)}
            licenseType={this.state.licenseData && this.state.licenseData.licenseType}
            authorName={this.state.workData.attributes.find(({key, value}) => key === 'author').value}
            /> }
      </section>

    )
  }

  componentDidMount() {
    document.title = 'Register New Work'
  }

  componentWillUnmount() {
    document.title = 'Poet';
  }

  getContentHash() {
    return this.getAttribute('contentHash');
  }

  getWordCount() {
    return parseInt(this.getAttribute('wordCount'), 10);
  }

  getAttribute(key: string) {
    const filter = this.state.workData.attributes.filter((entry) => entry.key === key);
    if (filter.length) {
      return filter[0].value;
    }
  }

  private onStepRegisterSubmit = (workData: StepRegisterData) => {
    const workTitleAttribute = workData.attributes.find(attribute => attribute.key == 'name');

    this.setState({
      selectedStep: 1,
      workData,
      workTitle: workTitleAttribute && workTitleAttribute.value
    });

    window.scrollTo(0, 0);
  };

  private onStepLicenseSubmit = (licenseData: StepLicenseData) => {
    this.setState({
      selectedStep: 2,
      licenseData: licenseData
    });

    window.scrollTo(0, 0);
  };

  private onStepLicenseSkip: (() => void) = () => {
    this.setState({ selectedStep: 2 });
    window.scrollTo(0, 0);
  };

  private submitWork() {
    const request = ([
      {
        type: 'Work',
        attributes: [
          ...this.state.workData.attributes,
          { key: 'mediaType', value: this.state.workData.mediaType },
          { key: 'articleType', value: this.state.workData.articleType },
          { key: 'content', value: this.state.workData.content },
          { key: 'dateSubmitted', value: '' + new Date().getTime() }
        ]
      },
    ]);
    if (this.state.licenseData) {
      request.push({
        type: 'Offering',
        attributes: {
          'licenseType': this.state.licenseData.licenseType.id,
          'licenseDescription': this.state.licenseData.licenseType.description,
          'pricingFrequency': this.state.licenseData.pricing.frequency,
          'pricingPriceAmount': '' + this.state.licenseData.pricing.price.amount,
          'pricingPriceCurrency': this.state.licenseData.pricing.price.currency,
          'paymentAddress': publicKeyToAddress(this.props.userPublicKey),
          'amountInSatoshis': (this.state.licenseData.pricing.price.amount * 1e8).toFixed(0)
        } as any
      })
    }
    this.props.createWorkRequested(request);
  }
}


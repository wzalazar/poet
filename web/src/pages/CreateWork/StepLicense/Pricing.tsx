import * as React from 'react';

import * as Common from '../../../common';
import { OptionGroup, Option } from '../../../components/OptionGroup';

import './Pricing.scss';

export interface PricingProps {
  readonly pricing: Common.Pricing;
  readonly onChange: (pricing: Common.Pricing) => void;
}

export class Pricing extends React.Component<PricingProps, undefined> {

  render() {
    return (
      <section className="pricing">
        <h2>Pricing</h2>
        <div className="row">
          <div className="col-sm-4 label"><label>Frequency</label></div>
          <div className="col-sm-8">
            <OptionGroup
              className="panel-option-group"
              selectedId={this.props.pricing.frequency}
              onOptionSelected={this.onFrequencyChange.bind(this)}
            >
              <Option id="oneTime">One Time</Option>
              <Option id="per-page-view">Per Page View</Option>
            </OptionGroup>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-4 label"><label>Price</label></div>
          <div className="col-sm-8">
            <div className="input-group">
              <input onChange={this.onAmountChange.bind(this)} type="number" className="form-control" aria-label="Amount (to the nearest dollar)" />
              <span className="input-group-addon">{ this.props.pricing.price.currency }</span>
            </div>
          </div>
        </div>
      </section>
    );
  }

  private onAmountChange(event: any) {
    this.props.onChange({
      ...this.props.pricing,
      price: {
        ...this.props.pricing.price,
        amount: event.target.value
      },
    });
  }

  private onFrequencyChange(frequency: Common.PricingFrequency) {
    this.props.onChange({
      ...this.props.pricing,
      frequency
    });
  }
}
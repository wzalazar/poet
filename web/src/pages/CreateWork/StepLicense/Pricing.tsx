import * as React from 'react';

import { Price } from '../../../common';
import { RadioButton, RadioButtonGroup } from '../../../components/RadioButtonGroup';

export type PricingFrequency = 'oneTime' | 'perPageView';

export interface PricingState {
  readonly price?: Price;
  readonly frequency?: PricingFrequency;
}

export class Pricing extends React.Component<undefined, PricingState> {
  public readonly pricingFrequencyOptions: ReadonlyArray<RadioButton> = [
    new RadioButton('oneTime', 'One Time'),
    new RadioButton('per-page-view', 'Per Page View')
  ];

  constructor() {
    super(...arguments);
    this.state = {
      price: {
        amount: 0,
        currency: 'BTC',
      },
      frequency: 'oneTime'
    }
  }

  render() {
    return (
      <section>
        <h3>Pricing</h3>
        <div className="row">
          <div className="col-sm-4">Frequency</div>
          <div className="col-sm-8">
            <RadioButtonGroup radioButtons={this.pricingFrequencyOptions} onSelectionChange={this.onFrequencyChange.bind(this)} />
          </div>
        </div>
        <div className="row mb-2">
          <div className="col-sm-4">Price</div>
          <div className="col-sm-8">
            <div className="input-group">
              <input onChange={this.onAmountChange.bind(this)} type="number" className="form-control" aria-label="Amount (to the nearest dollar)" />
              <span className="input-group-addon">{ this.state.price.currency }</span>
            </div>
          </div>
        </div>
      </section>
    );
  }

  private onAmountChange(event: any) {
    this.setState({
      price: {
        ...this.state.price,
        amount: event.target.value
      }
    })
  }

  private onFrequencyChange(id: string, text: string) {
    this.setState({
      frequency: id as PricingFrequency
    });
  }
}
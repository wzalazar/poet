import * as React from 'react';

import { Checkbox } from '../../../components/Checkbox';

interface PricingState {
  amount?: number;
  currency?: string;
  frequency?: 'oneTime' | 'perPageView';
}

export class Pricing extends React.Component<undefined, PricingState> {

  constructor() {
    super(...arguments);
    this.state = {
      amount: 0,
      currency: 'USD',
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
            <Checkbox text="One Time" />
            <Checkbox text="Per Page View" />
          </div>
        </div>
        <div className="row mb-2">
          <div className="col-sm-4">Price</div>
          <div className="col-sm-8">
            <div className="input-group">
              <span className="input-group-addon">$</span>
              <input onChange={this.onAmountChange.bind(this)} type="text" className="form-control" aria-label="Amount (to the nearest dollar)" />
              <span className="input-group-addon">BTC</span>
            </div>
          </div>
        </div>
      </section>
    );
  }

  private onAmountChange(event: any) {
    this.setState({
      amount: event.target.value
    })
  }
}
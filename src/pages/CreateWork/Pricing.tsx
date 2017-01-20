import * as React from 'react';

import { Checkbox } from '../../components/Checkbox';

export class Pricing extends React.Component<any, undefined> {
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
              <input type="text" className="form-control" aria-label="Amount (to the nearest dollar)" />
              <span className="input-group-addon">.00</span>
            </div>
          </div>
        </div>
      </section>
    );
  }
}
import * as React from 'react';
import { connect } from 'react-redux';

import { TermsOfUse } from './TermsOfUse';
import { Preview } from './Preview';
import Actions from '../../../actions'

class StepPublishAndReview extends React.Component<any, any> {
  render() {
    return (
      <section className="step-3-publish">
        <h2>Review &amp; Publish</h2>
        <div className="row">
          <div className="col-sm-7">
            <TermsOfUse className="mb-2"/>
            <button onClick={this.props.submit} className="btn btn-primary">Timestamp to the blockchain</button>
          </div>
          <Preview className="col-sm-5 mb-2 border-1 p-1" />
        </div>
      </section>
    )
  }
}

export default connect((s: any) => s, {
  submit: (data: any) => ({ type: Actions.createWorkRequested })
})(StepPublishAndReview)
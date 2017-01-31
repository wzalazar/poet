import * as React from 'react'

import { Price, LicenseType } from '../../../common';

import { TermsOfUse } from './TermsOfUse'
import { Preview } from './Preview'

import './StepPublishAndReview.scss';

export interface StepPublishAndReviewProps {
  readonly onSubmit: () => void;
  readonly authorName?: string;
  readonly workTitle: string;
  readonly price: Price;
  readonly licenseType: LicenseType;
}

export default class StepPublishAndReview extends React.Component<StepPublishAndReviewProps, any> {
  render() {
    return (
      <section className="step-3-publish">
        <h2>Review &amp; Publish</h2>
        <div className="row">
          <div className="col-sm-7">
            <TermsOfUse className="mb-2"/>
            <button onClick={this.props.onSubmit} className="btn btn-primary">Timestamp to the blockchain</button>
          </div>
          <Preview
            className="preview col-sm-5 mb-2 border-1 p-1"
            authorName={this.props.authorName}
            workTitle={this.props.workTitle}
            mediaType="Article"
            price={this.props.price}
            licenseType={this.props.licenseType}
          />
        </div>
      </section>
    )
  }
}


import * as React from 'react';

import { Work, WorkOffering } from "../../atoms/Interfaces";
import { PoetAPIResourceProvider } from '../../atoms/base/PoetApiResource';

import './WorkOfferings.scss';

interface WorkOfferingsProps {
  readonly workId: string;
  readonly onPurchaseRequest: (workOffering: WorkOffering) => void;
}

export class WorkOfferings extends PoetAPIResourceProvider<Work, WorkOfferingsProps, undefined> {

  poetURL() {
    return `/works/${this.props.workId}`;
  }

  renderElement(work: Work): JSX.Element {
    if (!work || !work.offerings || !work.offerings.length)
      return <section className="offerings">This work has no offerings</section>;

    return (
      <section className="offerings">
        { work.offerings.map(this.renderOffering.bind(this)) }
      </section>
    )
  }

  private renderOffering(workOffering: WorkOffering): JSX.Element {
    return (
      <section className="offering" key={workOffering.id} >
        <h3>License</h3>
        <main>
          <div className="info row">
            <div className="description col-xs-7">
              { workOffering.attributes.licenseDescription || 'This offering lacks a description. Please contact the author.' }
            </div>
            <div className="col-xs-5">
              <div className="price">
                { workOffering.attributes.pricingPriceAmount || 0 }&nbsp;
                { workOffering.attributes.pricingPriceCurrency || 'BTC' }
              </div>
              <div className="type">
                { workOffering.attributes.licenseType }
              </div>
            </div>
          </div>
          <button className="button-primary" onClick={() => this.props.onPurchaseRequest(workOffering)}>Purchase License</button>
        </main>
        { workOffering.licenses && this.renderLicenses(workOffering.licenses) }
      </section>
    );
  }

  renderLicenses(licenses: ReadonlyArray<any>) {
    return (
      <section className="licenses">
        <h3>Publishers with this license </h3>
        { licenses.map(this.renderLicense.bind(this)) }
      </section>
    )
  }

  renderLicense(license: any): JSX.Element {
    return (
      <section className="license" key={license.id}>
        <div className="publisher">{ license.publisher }</div>
        <div className="url"><a href={ license.url } target="_blank">{ license.url }</a></div>
      </section>
    )
  }
}
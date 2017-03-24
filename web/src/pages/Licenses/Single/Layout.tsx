import * as React from 'react';
import './Layout.scss';
import { License } from '../../../Interfaces';
import { SelectLicenseById } from '../../../components/atoms/Arguments';
import { ReferencedWorkNameWithLink } from '../../../components/atoms/License';
import { PoetAPIResourceProvider } from '../../../components/atoms/base/PoetApiResource';
import { LicenseOwnerNameWithLink, LicenseEmitterNameWithLink, LicenseEmittedDate } from '../../../components/atoms/Profile';
import { WorkHashById } from '../../../components/atoms/Work';
import moment = require('moment');
import { Configuration } from '../../../configuration';
import { badge } from '../../../components/LicenseBadge';

export class SingleLicense extends PoetAPIResourceProvider<License, SelectLicenseById, undefined> {

  textarea: HTMLTextAreaElement;

  poetURL(): string {
    return '/licenses/' + this.props.licenseId;
  }

  renderElement(resource: License, headers: Headers): JSX.Element {
    return (
      <section className="container page-licenses">
        <header>
          <h1>License information</h1>
        </header>
        <div className="license-view container">
          <div className="creative license-item row">
            <div className="title col-sm-4">
              Name of the work:
            </div>
            <div className="value col-sm-8">
              <ReferencedWorkNameWithLink license={resource} />
            </div>
          </div>
          <div className="licensed-to license-item row">
            <div className="title col-sm-4">
              Licensee:
            </div>
            <div className="value col-sm-8">
              <LicenseOwnerNameWithLink license={resource} />
            </div>
          </div>
          <div className="licensed-from license-item row">
            <div className="title col-sm-4">
              Owner:
            </div>
            <div className="value col-sm-8">
              <LicenseEmitterNameWithLink license={resource} />
            </div>
          </div>
          <div className="licensed-from license-item row">
            <div className="title col-sm-4">
              License emitted on:
            </div>
            <div className="value col-sm-8">
              <LicenseEmittedDate license={resource} />
            </div>
          </div>
          <div className="licensed-from license-item row">
            <div className="title col-sm-4">
              Work hash:
            </div>
            <div className="value col-sm-8">
              <WorkHashById workId={resource.reference.id} />
            </div>
          </div>
          <div className="licensed-from license-item row">
            <div className="title col-sm-4">
              Embed link:
            </div>
            <div className="value col-sm-8">
              <div className="iframe">
                <textarea value={badge(resource.id, moment(resource.claimInfo.timestamp * 1000).format(Configuration.dateTimeFormat))} ref={textarea => this.textarea = textarea} />
                <button onClick={this.onCopy}>Copy</button>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  private onCopy = () => {
    this.textarea.select();
    document.execCommand('copy');
  };
}


import * as React from 'react';
import './Layout.scss';
import { License } from '../../../Interfaces';
import { SelectLicenseById } from '../../../components/atoms/Arguments';
import { ReferencedWorkNameWithLink } from '../../../components/atoms/License';
import { PoetAPIResourceProvider } from '../../../components/atoms/base/PoetApiResource';
import { LicenseOwnerNameWithLink, LicenseEmitterNameWithLink, LicenseEmittedDate } from '../../../components/atoms/Profile';
import { WorkHashById } from '../../../components/atoms/Work';

export class SingleLicense extends PoetAPIResourceProvider<License, SelectLicenseById, undefined> {

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
        </div>
      </section>
    )
  }
}


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

export class SingleLicense extends PoetAPIResourceProvider<License, SelectLicenseById, undefined> {

  textarea: HTMLTextAreaElement;

  license = (id: string, time: string) => `<iframe src="https://poet.host/p/${id}" width="165" height="50" style="border: none"><link href="https://fonts.googleapis.com/css?family=Roboto" rel="stylesheet"></head><iframe> <div style=" width: 165px; height: 50px; background-color: white; font-family: Roboto; font-size: 12px; border: 1px solid #CDCDCD; border-radius: 4px; box-shadow: 0 2px 0 0 #F0F0F0;"> <a href="https://poet.host/l/${id}" style=" color: #35393E; text-decoration: none; display: flex; flex-direction: row;  height: 50px"> <img src="https://poet.host/images/quill64.png" style=" width: 31px; height: 31px; margin-top: 8px; margin-left: 8px; margin-right: 8px; background-color: #393534; color: #35393E; font-family: Roboto;"> <div><p style="padding-top: 10px; line-height: 15px; margin: 0; font-size: 10pt; font-weight: bold; text-align: left;">Licensed via po.et</p><p style="text-align: left; line-height: 15px; margin: 0; font-size: 10px; padding-top: 1px; font-size: 8px; font-family: Roboto; font-weight: bold; line-height: 13px; color: #707070;">${time}</p></div></a></div></iframe>`;

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
                <textarea value={this.license(resource.id, moment(resource.claimInfo.timestamp * 1000).format(Configuration.dateTimeFormat))} ref={textarea => this.textarea = textarea} />
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


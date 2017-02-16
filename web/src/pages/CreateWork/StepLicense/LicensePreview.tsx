import * as React from 'react';
const classNames = require('classnames');

import { LicenseType, LicenseTypes, ClassNameProps } from '../../../common';

import './LicensePreview.scss';

export interface LicensePreviewState {
  readonly licenseType?: LicenseType;
}

export class LicensePreview extends React.Component<ClassNameProps, LicensePreviewState> {
  constructor() {
    super(...arguments);
    this.state = {
      licenseType: LicenseTypes[0]
    }
  }

  render() {
    return (
      <section className={classNames('license-preview', this.props.className)}>
        <div><h2>License Preview</h2></div>
        <div className="license">
          <div className="name">{ this.state.licenseType.name }</div>
          <div className="description">{ this.state.licenseType.description }</div>
        </div>
      </section>
    );
  }

  public setLicenseType(licenseType: LicenseType) {
    this.setState({
      licenseType
    })
  }
}
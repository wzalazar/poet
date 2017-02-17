import * as React from 'react';
const classNames = require('classnames');

import { LicenseType, ClassNameProps } from '../../../common';

import './LicensePreview.scss';

export interface LicensePreviewProps extends ClassNameProps {
  readonly licenseType?: LicenseType;
}

export class LicensePreview extends React.Component<LicensePreviewProps, undefined> {

  render() {
    return (
      <section className={classNames('license-preview', this.props.className)}>
        <div><h2>License Preview</h2></div>
        <div className="license">
          <div className="name">{ this.props.licenseType.name }</div>
          <div className="description">{ this.props.licenseType.description }</div>
        </div>
      </section>
    );
  }

}
import * as React from 'react';

export interface LicensePreviewProps {
  readonly className?: string;
}

export interface LicensePreviewState {
  readonly licenseType?: string;
}

export class LicensePreview extends React.Component<LicensePreviewProps, LicensePreviewState> {
  constructor() {
    super(...arguments);
    this.state = {
      licenseType: 'Attribution Only'
    }
  }

  render() {
    return (
      <section className={this.props.className}>
        <div><h4>Preview</h4></div>
        <div>
          <div>{ this.state.licenseType }</div>
          <div>Lorem ipsum blah blah blah</div>
        </div>
      </section>
    );
  }

  public setLicenseType(value: string) {
    this.setState({
      licenseType: value
    })
  }
}
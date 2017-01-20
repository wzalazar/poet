import * as React from 'react';

export interface LicensePreviewProps {
  className?: string;
}

export class LicensePreview extends React.Component<LicensePreviewProps, undefined> {
  render() {
    return (
      <section className={this.props.className}>
        <div><h4>Preview</h4></div>
        <div>
          <div>Attribution License</div>
          <div>Lorem ipsum blah blah blah</div>
        </div>
      </section>
    );
  }
}
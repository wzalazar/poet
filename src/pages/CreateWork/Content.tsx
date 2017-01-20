import * as React from 'react';

import { HexString } from '../../common';

import './Layout.scss';
import { MediaType } from './MediaType';

interface ContentProps {
  className?: string;
}

export class Content extends React.Component<ContentProps, undefined> {
  render() {
    return (
      <section className={this.props.className}>
        <h2>Content</h2>
        <form>
          <div className="form-group row">
            <label htmlFor={`inputContent`} className="col-sm-2 col-form-label">Content</label>
            <div className="col-sm-10">
              <input type="text" className="form-control" id={`inputContent`} placeholder="Content" />
            </div>
          </div>
          <input type="file" accept="*/*" name="file" />
        </form>
      </section>
    )
  }

}

import * as React from 'react';

import { HexString } from '../../common';

import './Layout.scss';
import { MediaType } from './MediaType';

interface FieldsProps {
  className?: string;
}

export class Fields extends React.Component<FieldsProps, undefined> {
  readonly fields = [
    {
      id: 'email',
      text: 'Email'
    },
    {
      id: 'content-url',
      text: 'Content URL'
    }
  ];

  render() {
    return (
    <section className={'mb-3 ' + this.props.className}>
      <h2>Fields</h2>
      <form>
        { this.fields.map(this.renderField.bind(this)) }
      </form>
      <button className="btn btn-secondary">Add Field</button>
    </section>
    )
  }

  private renderField({id, text}: {id: string, text: string}): JSX.Element {
    return (
      <div key={id} className="form-group row">
        <label htmlFor={`input${id}`} className="col-sm-2 col-form-label">{text}</label>
        <div className="col-sm-10">
          <input type="email" className="form-control" id={`input${id}`} placeholder={text} />
        </div>
      </div>
    );
  }
}

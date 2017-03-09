import * as React from 'react';
import * as ReactDatePicker from 'react-datepicker';
import * as moment from 'moment';

import { DatePickerInput } from '../../../atoms/DatePickerInput';
import { AttributeName } from './AttributeName';

import './Attribute.scss';

export interface AttributeProps {
  keyName: string;
  value: string;
  readonly optional?: boolean;
  readonly onKeyChange: (key: string) => void;
  readonly onValueChange: (value: string) => void;
  readonly onRemove: () => void;
}

export class Attribute extends React.Component<AttributeProps, undefined> {
  private attributeName: AttributeName;

  render() {
    return (
      <div className="row attribute">
        <div className="col-sm-4">
          <AttributeName
            onChange={this.props.onKeyChange}
            attributeName={this.props.keyName}
            ref={attributeName => this.attributeName = attributeName}
          />
        </div>
        <div className="col-sm-7">
          { this.isDate(this.props.keyName) ? this.renderValueDate() : this.renderValueText() }
        </div>
        <div className="col-sm-1">
          { this.props.optional && <button
            onClick={this.onRemove.bind(this)}
            className="remove button-secondary">—</button> }
        </div>
      </div>
    )
  }

  private onRemove(event: Event) {
    event.preventDefault();
    this.props.onRemove();
  }

  private isDate(keyName: string) {
    return ['dateCreated', 'datePublished'].includes(keyName);
  }

  private renderValueText() {
    return <input
      onChange={(event: any) => this.props.onValueChange(event.target.value)}
      type="text"
      placeholder="Attribute Value"
      value={this.props.value} />;
  }

  private renderValueDate() {
    const value = moment(parseInt(this.props.value));
    return <ReactDatePicker
      onChange={(moment: moment.Moment) => this.props.onValueChange(moment.toDate().getTime().toString())}
      selected={value.isValid() ? value : null}
      dateFormat="dddd, MMMM Do YYYY"
      customInput={<DatePickerInput/>} />;
  }

  focus() {
    this.attributeName.focus();
  }
}
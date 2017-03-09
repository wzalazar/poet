import * as React from 'react';

import { Images } from '../images/Images';

import './DatePickerInput.scss';

export class DatePickerInput extends React.Component<any, undefined>{
  render() {
    return (
      <button
        className="calendar-button"
        onClick={this.props.onClick}>
        <span>{this.props.value}</span>
        <img src={Images.Calendar}/>
      </button>
    )
  }
}
import * as React from 'react';
import * as classNames from 'classnames';

import { Images } from '../images/Images';
import { ClassNameProps } from '../common';

import './DatePickerInput.scss';

interface DatePickerInputProps extends ClassNameProps {
  readonly value?: string;
  readonly onClick?: () => void;
  readonly onBlur?: () => void;
}

export class DatePickerInput extends React.Component<DatePickerInputProps, undefined>{
  render() {
    return (
      <button
        className={classNames('calendar-button', this.props.className)}
        onClick={this.props.onClick}
        onBlur={this.props.onBlur}>
        <span>{this.props.value || 'Select a Date'}</span>
        <img src={Images.Calendar}/>
      </button>
    )
  }
}
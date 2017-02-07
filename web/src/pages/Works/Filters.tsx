import * as React from 'react';
import * as moment from 'moment';
import * as ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import './Filters.scss';

export interface FilterComponentState {
  readonly dateFrom?: moment.Moment;
  readonly dateTo?: moment.Moment;
}

class CustomInput extends React.Component<any, any>{
  render() {
    return (
      <div>
        <button
          className="btn btn-secondary btn-sm"
          onClick={this.props.onClick}>
          {this.props.value}
        </button>
      </div>
    )
  }
}

export class FiltersComponent extends React.Component<any, FilterComponentState> {
  constructor() {
    super(...arguments);
    this.state = {
      dateFrom: moment().subtract(7, 'days'),
      dateTo: moment()
    }
  }
  private renderDropdown(text: string, options: string[]) {
    return (
      <div className="pr-1">
        <span className="mr-1">{text}</span>
        <select>
          { options.map((option, index) => <option key={index}>{option}</option>)}
        </select>
      </div>
    );
  }

  private renderDateSelector(text: string) {
    return (
      <div className="date-picker pr-1">
        <strong>{text}&nbsp;</strong>
        <span className="mr-1">between</span>
        <ReactDatePicker onChange={this.onDateFromChange.bind(this)} selected={this.state.dateFrom} customInput={<CustomInput/>} />
        <span className="mx-1">and</span>
        <ReactDatePicker onChange={this.onToFromChange.bind(this)} selected={this.state.dateTo} customInput={<CustomInput/>} />
      </div>
    );
  }


  render() {
    return (
      <header>
        <div className="container">
          { this.renderDropdown('Sort by', ['Most Trusted', 'Date Published', 'Licenses Sold'])}
          { this.renderDropdown('License', ['Free to Use', 'MIT', 'Private'])}
          { this.renderDateSelector('Created')}
        </div>
      </header>
    );
  }

  private onDateFromChange(dateFrom: moment.Moment) {
    this.setState({
      dateFrom
    });
  }

  private onToFromChange(dateTo: moment.Moment) {
    this.setState({
      dateTo
    });
  }

}
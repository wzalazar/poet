import * as React from 'react';

import './Filters.scss';

export default class FiltersComponent extends React.Component<any, undefined> {

  private renderDropdown(text: string, options: string[]) {
    return (
      <div className="pr-1">
        <span className="mr-1">{text}</span>
        <select>
          { options.map(option => <option>{option}</option>)}
        </select>
      </div>
    );
  }

  private renderDateSelector(text: string) {
    return (
      <div className="date-picker pr-1">
        <span className="mr-1">{text}</span>
        <span>between</span>
        <input type="text" className="px-1 mx-1" placeholder="this will be a date picker" />
        <span>and</span>
        <input type="text" className="px-1 mx-1" placeholder="this will be a date picker" />

      </div>
    );
  }


  render() {
    return (
      <header className="mb-3 d-flex p-1">
        { this.renderDropdown('Sort by', ['Most Trusted', 'Date Published', 'Licenses Sold'])}
        { this.renderDropdown('License', ['Free to Use', 'MIT', 'Private'])}
        { this.renderDateSelector('Created')}
      </header>
    );
  }
}
import * as React from 'react';

class FilterItem {
  name: string;
  text: string;

  constructor(name: string, text: string) {
    this.name = name;
    this.text = text;
  }
}

export class LicensesFilters extends React.Component<any, undefined> {
  private readonly items: FilterItem[] = [
    new FilterItem('all', 'All'),
    new FilterItem('authored', 'Authored'),
    new FilterItem('purchased', 'Purchased'),
    new FilterItem('transferred', 'Transferred')
  ];

  private selectedItem: number = 0;

  private renderItem(filterItem: FilterItem, index: number) {
    return (
      <li key={filterItem.name} className="nav-item">
        <a className={'nav-link ' + (this.selectedItem === index ? 'active' : '')} onClick={this.onItemToggle.bind(this, index)} href="#">{filterItem.text}</a>
      </li>
    )
  }

  render() {
    return (
      <ul className="nav nav-tabs">
        { this.items.map(this.renderItem.bind(this)) }
      </ul>
    )
  }

  private onItemToggle(index: number) {
    this.selectedItem = index;
    this.forceUpdate();
  }
}

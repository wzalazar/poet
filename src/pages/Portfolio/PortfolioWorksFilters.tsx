import * as React from 'react';

class FilterItem {
  name: string;
  text: string;
  status: boolean = false;

  constructor(name: string, text: string, status: boolean = false) {
    this.name = name;
    this.text = text;
    this.status = status;
  }
}

export class PortfolioWorksFilters extends React.Component<any, undefined> {
  readonly items: FilterItem[] = [
    new FilterItem('all', 'All'),
    new FilterItem('articles', 'Articles'),
    new FilterItem('images', 'Images'),
    new FilterItem('audio', 'Audio'),
    new FilterItem('video', 'Video')
  ];

  private renderItem(filterItem: FilterItem) {
    return (
      <li key={filterItem.name} className="nav-item">
        <a className={'nav-link ' + (filterItem.status ? 'active' : '')} onClick={this.onItemToggle.bind(this, filterItem)} href="#">{filterItem.text}</a>
      </li>
    )
  }

  render() {
    return (
      <ul className="nav nav-pills">
        { this.items.map(item => this.renderItem(item)) }
      </ul>
    )
  }

  private onItemToggle(filterItem: FilterItem) {
    filterItem.status = !filterItem.status;
    this.forceUpdate();
  }
}

import * as React from 'react';

import '../../extensions/Array'
import './Tabs.scss';

import { HexString } from '../../common';

import ContentTab from './ContentTab';
import HistoryTab from './HistoryTab';
import StatsTab from './StatsTab';
import TechnicalTab from './TechnicalTab';

interface TabState {
  selectedTab: string;
}

interface TabProps {
  id: HexString;
}

export default class Tabs extends React.Component<TabProps, TabState> {
  private readonly tabs = this.createTabs();

  constructor() {
    super(...arguments);
    this.state = {
      selectedTab: 'content'
    };
  }

  private tabKeys(): string[] {
    return [...this.tabs.keys()];
  }

  private createTabs(): Map<string, JSX.Element> {
    const tabs = new Map<string, JSX.Element>();

    tabs.set('content', <ContentTab id={this.props.id} />);
    tabs.set('history', <HistoryTab id={this.props.id} />);
    tabs.set('stats', <StatsTab id={this.props.id} />);
    tabs.set('technical', <TechnicalTab id={this.props.id} />);

    return tabs;
  }

  private renderSelectedTab(): JSX.Element {
    const element = this.tabs.get(this.state.selectedTab);

    if (!element)
      throw new Error(`Could not find JSX Element for the selected tab '${this.state.selectedTab}'.`);

    return element;
  }

  private tabSelected(tabName: string) {
    if (!this.tabKeys().includes(tabName))
      throw new Error(`Tab ${tabName} doesn't exist. Available tabs are: ${this.tabKeys().join(', ')}`);

    this.setState({
      selectedTab: tabName
    });
  }

  private renderTabHeader(tabName: string) {
    return <li key={tabName} onClick={this.tabSelected.bind(this, tabName)} className={this.state.selectedTab == tabName ? 'selected' : ''}>{tabName}</li>;
  }

  render() {
    return (
      <div className="tabs">
        <div className="header">
          <ul>
            { this.tabKeys().map(this.renderTabHeader.bind(this)) }
          </ul>
        </div>
        <div className="content">
          { this.renderSelectedTab() }
        </div>
      </div>
    )
  }
}

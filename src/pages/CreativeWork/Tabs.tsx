import * as React from 'react';

import '../../extensions/Array'
import './style.scss';

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

  constructor() {
    super(...arguments);
    this.state = {
      selectedTab: 'content'
    };
  }

  private tabs(): Map<string, JSX.Element> {
    const tabs = new Map<string, JSX.Element>();

    tabs.set('content', <ContentTab id={this.props.id} />);
    tabs.set('history', <HistoryTab id={this.props.id} />);
    tabs.set('stats', <StatsTab id={this.props.id} />);
    tabs.set('technical', <TechnicalTab id={this.props.id} />);

    return tabs;
  }

  private renderSelectedTab(): JSX.Element {
    const render = this.tabs().get(this.state.selectedTab);

    if (!render)
      throw new Error(`Could not find JSX Element for the selected tab '${this.state.selectedTab}'.`);

    return render;
  }

  private tabSelected(tabName: string) {
    if (![...this.tabs().keys()].includes(tabName))
      throw new Error(`Tab ${tabName} doesn't exist. Available tabs are: ${[...this.tabs().keys()].join(', ')}`);

    this.setState({
      selectedTab: tabName
    });
  }

  render() {
    return (
      <div className="tabs">
        <div className="header">
          <ul>
            {
              [...this.tabs().keys()].map(tabName => (
                <li key={tabName} onClick={this.tabSelected.bind(this, tabName)} className={this.state.selectedTab == tabName ? 'selected' : ''}>{tabName}</li>
              ))
            }
          </ul>
        </div>
        <div className="content">
          { this.renderSelectedTab() }
        </div>
      </div>
    )
  }
}

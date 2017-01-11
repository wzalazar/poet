import * as React from 'react';

import '../../extensions/Array'
import './style.scss';

import ContentTab from './ContentTab';
import HistoryTab from './HistoryTab';
import StatsTab from './StatsTab';
import TechnicalTab from './TechnicalTab';

interface TabState {
  selectedTab: string;
}

export default class Tabs extends React.Component<undefined, TabState> {

  constructor() {
    super(...arguments);
    this.state = {
      selectedTab: 'content'
    };
  }

  private tabs(): Map<string, () => JSX.Element> {
    const tabs = new Map<string, () => JSX.Element>();

    tabs.set('content', this.renderContentTab);
    tabs.set('history', this.renderHistoryTab);
    tabs.set('stats', this.renderStatsTab);
    tabs.set('technical', this.renderTechnicalTab);

    return tabs;
  }

  private renderContentTab(): JSX.Element {
    return <ContentTab id="334s" />;
  }

  private renderHistoryTab(): JSX.Element {
    return <HistoryTab id="334s" />;
  }

  private renderStatsTab(): JSX.Element {
    return <StatsTab id="334s" />;
  }

  private renderTechnicalTab(): JSX.Element {
    return <TechnicalTab id="334s" />;
  }

  private renderSelectedTab(): JSX.Element {
    const render = this.tabs().get(this.state.selectedTab);

    if (!render)
      throw new Error('Could not find rendered function for the selected tab.');

    return render();
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

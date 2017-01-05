import * as React from "react";

import './style.scss';

interface TabState {
  selectedTab: string;
};

export default class Tabs extends React.Component<undefined, TabState> {

  constructor() {
    super(...arguments);
    this.state = {
      selectedTab: 'content'
    };
  }

  tabs(): Map<string, () => JSX.Element> {
    const tabs = new Map<string, () => JSX.Element>();

    tabs.set('content', this.renderContentTab);
    tabs.set('history', this.renderHistoryTab);

    return tabs;
  }

  renderContentTab(): JSX.Element {
    return (
      <div className="contentTab">
        <h1>Content</h1>
      </div>
    );
  }

  renderHistoryTab(): JSX.Element {
    return (
      <div className="historyTab">
        <h1>History</h1>
      </div>
    );
  }

  renderSelectedTab(): JSX.Element {
    const render = this.tabs().get(this.state.selectedTab);

    if (!render)
      throw new Error('Could not find rendered function for the selected tab.');

    return render();
  }

  tabSelected(tabName: string) {
    if (!(tabName in this.tabs().keys()))
      throw new Error(`Tab ${tabName} doesn't exist. Available tabs are: ${[...this.tabs().keys()].join()}`);

    this.state.selectedTab = tabName;
  }

  render() {
    return (
      <div className="tabs">
        <div className="header">
          <ul>
            {
              [...this.tabs().keys()].map(tabName => (
                <li onClick={this.tabSelected.bind(this, tabName)}>{tabName}</li>
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

import * as React from "react";

import './style.scss';

interface Claim {

}

export interface ContentTabProps {

}

export interface HistoryTabProps {
  author: string;
  award: string;
  character: string;

  content: string;
}

export interface TabsProps {
  content: ContentTabProps;
  history: HistoryTabProps;
}

export interface TabsState {
  selectedTab: string;
}

export default class Tabs extends React.Component<TabsProps, TabsState> {

  get tabs(): Map<string, () => JSX.Element> {
    const tabs = new Map<string, () => JSX.Element>();

    tabs.set('content', this.renderContentTab);
    tabs.set('history', this.renderHistoryTab);

    return tabs;
  }

  renderContentTab(): JSX.Element {
    return (
      <div className="contentTab">
        { this.props.content }
      </div>
    );
  }

  renderHistoryTab(): JSX.Element {
    return (
      <div> { this.props.history } </div>
    );
  }

  renderSelectedTab(): JSX.Element {
    const render = this.tabs.get(this.state.selectedTab);

    if (!render)
      throw new Error('Could not find rendered function for the selected tab.');

    return render();
  }

  tabSelected(tabName: string) {
    if (!(tabName in this.tabs.keys()))
      throw new Error(`Tab ${tabName} doesn't exist. Available tabs are: ${[...this.tabs.keys()].join()}`);

    this.state.selectedTab = tabName;
  }

  render() {
    return (
      <div className="tabs">
        <div className="header">
          <ul>
            {
              [...this.tabs.keys()].map(tabName => (
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

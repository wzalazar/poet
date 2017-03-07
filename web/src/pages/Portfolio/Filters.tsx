import * as React from 'react';

import { OptionGroup, Option } from '../../components/OptionGroup';

import './Filters.scss';

interface PortfolioWorksFiltersProps {
  readonly selectedId: string;
  readonly onOptionSelected: (id: string) => void;
}

export class PortfolioWorksFilters extends React.Component<PortfolioWorksFiltersProps, undefined> {
  public static readonly ALL = 'all';
  public static readonly OWNED = 'owned';
  public static readonly AUTHORED = 'authored';

  render() {
    return (
      <OptionGroup selectedId={this.props.selectedId} onOptionSelected={this.props.onOptionSelected} className="tab-option-group extended">
        <Option id={PortfolioWorksFilters.OWNED}>Owned Works</Option>
        <Option id={PortfolioWorksFilters.AUTHORED}>Authored Works</Option>
        <Option id={PortfolioWorksFilters.ALL}>All Works</Option>
      </OptionGroup>
    )
  }

}

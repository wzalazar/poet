import * as React from 'react';

import { OptionGroup, Option } from '../../components/molecules/OptionGroup';

import './Filters.scss';

interface FiltersProps {
  readonly selectedId: string;
  readonly onOptionSelected: (id: string) => void;
}

export class Filters extends React.Component<FiltersProps, undefined> {
  public static readonly ALL = 'all';
  public static readonly SOLD = 'sold';
  public static readonly PURCHASED = 'purchased';

  render() {
    return (
      <OptionGroup selectedId={this.props.selectedId} onOptionSelected={this.props.onOptionSelected} className="tab-option-group extended">
        <Option id={Filters.ALL}>All</Option>
        <Option id={Filters.SOLD}>Sold</Option>
        <Option id={Filters.PURCHASED}>Purchased</Option>
      </OptionGroup>
    )
  }

}

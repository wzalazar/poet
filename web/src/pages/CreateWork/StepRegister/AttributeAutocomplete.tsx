import * as React from 'react';
const Autocomplete = require('react-autocomplete');
const classNames = require('classnames');

import { ResourceProvider } from '../../../components/ResourceProvider';

import './AttributeAutocomplete.scss';

interface AttributeNameAutocompleteResource {

}

interface AttributeNameAutocompleteProps {
  readonly attributeName?: string;
  readonly onChange?: (name: string) => void;
}

interface AttributeNameAutocompleteState {
  readonly menuIsOpen: boolean;
}

export class AttributeNameAutocomplete extends ResourceProvider<AttributeNameAutocompleteResource, AttributeNameAutocompleteProps, AttributeNameAutocompleteState> {

  constructor() {
    super(...arguments);
    this.state = {
      menuIsOpen: false
    }
  }

  resourceLocator() {
    return {
      url: 'http://www.mocky.io/v2/58b49e411000002001ea553f'
    }
  }

  renderElement(suggestions: AttributeNameAutocompleteResource) {
    const mockSuggestions: ReadonlyArray<string> = ['name', 'author', 'size'];
    return <Autocomplete
      items={mockSuggestions}
      value={this.props.attributeName}
      renderMenu={this.renderMenu.bind(this)}
      renderItem={this.renderMenuItem.bind(this)}
      onSelect={(value: string, item: any) => this.props.onChange(item)}
      onChange={(event: any, value: string) => this.props.onChange(value)}
      getItemValue={(item: any) => item}
      wrapperProps={{className: 'autocomplete'}}
      inputProps={{className: classNames('input-text', this.state.menuIsOpen && 'open'), placeholder: 'Attribute Name'}}
      onMenuVisibilityChange={(menuIsOpen: boolean) => this.setState({menuIsOpen})}
    />;
  }

  private renderMenu(children: any) {
    return <ul className="menu">{children}</ul>;
  }

  private renderMenuItem(item: any) {
    const matches = this.props.attributeName && this.props.attributeName.length > 1 && item.includes(this.props.attributeName);
    const matchedItem = matches &&
      <span>{item.split(this.props.attributeName)[0]}<b>{this.props.attributeName}</b>{item.split(this.props.attributeName)[1]}</span>;

    return (
      <li key={item} className={classNames(matches && 'highlighted')}>
        {matches ? matchedItem : item}
      </li>
    );
  }
}
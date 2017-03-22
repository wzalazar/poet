import * as React from 'react';
const Autocomplete = require('react-autocomplete');
import * as classNames from 'classnames';

import { load } from '../../../schema.org';

interface AttributeNameProps {
  readonly attributeName?: string;
  readonly onChange?: (name: string) => void;
  readonly readOnly: boolean;
}

interface AttributeNameState {
  readonly menuIsOpen?: boolean;
  readonly schema?: any;
}

export class AttributeName extends React.Component<AttributeNameProps, AttributeNameState> {
  private autocomplete: any;

  constructor() {
    super(...arguments);
    this.state = {
      menuIsOpen: false
    };
  }

  componentDidMount() {
    load((schema: any) => this.setState({ schema }));
  }

  render() {
    if (!this.props.readOnly)
      return <Autocomplete
        ref={(autocomplete: any) => this.autocomplete = autocomplete}
        items={this.state.schema ? this.state.schema.types.CreativeWork.properties : []}
        value={this.props.attributeName}
        renderMenu={this.renderMenu.bind(this)}
        renderItem={this.renderMenuItem.bind(this)}
        onSelect={(value: string, item: any) => this.props.onChange(item)}
        onChange={(event: any, value: string) => this.props.onChange(value)}
        getItemValue={(item: any) => item}
        shouldItemRender={this.shouldItemRender.bind(this)}
        wrapperProps={{className: 'autocomplete'}}
        inputProps={{className: classNames('input-text', this.state.menuIsOpen && 'open'), placeholder: 'Attribute Name'}}
        onMenuVisibilityChange={(menuIsOpen: boolean) => this.setState({menuIsOpen})}
      />;
    else
      return <input type="text" value={this.props.attributeName} readOnly />;
  }

  private renderMenu(children: any) {
    return <ul className="menu">{children}</ul>;
  }

  private renderMenuItem(item: string) {
    const splits = item.split(new RegExp(`(${this.props.attributeName})`, 'i'));
    const matchedItem = splits.map((s, i) => <span key={i} className={classNames(this.shouldItemRender(s, this.props.attributeName) && 'matched')}>{s}</span>);

    return (
      <li key={item}>
        { matchedItem }
      </li>
    );
  }

  private shouldItemRender(item: string, value: string) {
    return value && item.toLowerCase().includes(value.toLowerCase());
  }

  public focus() {
    if (!this.props.readOnly)
      this.autocomplete.refs.input.focus();
  }
}
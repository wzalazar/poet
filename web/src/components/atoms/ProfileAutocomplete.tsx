import * as React from 'react';
import * as classNames from 'classnames';
const Autocomplete = require('react-autocomplete');

import { PoetAPIResourceProvider } from './base/PoetApiResource';
import { ClassNameProps } from '../../common';

interface ProfileAutocompleteResource {
  readonly id: string;
  readonly displayName: string;
}

interface ProfileAutocompleteProps extends ClassNameProps {
  readonly value: string;
  readonly onSelect: (profile: string) => void;
  readonly onChange: (profile: string) => void;
}

interface ProfileAutocompleteState {
  readonly menuIsOpen?: boolean;
}

export class ProfileAutocomplete extends PoetAPIResourceProvider<ReadonlyArray<ProfileAutocompleteResource>, ProfileAutocompleteProps, ProfileAutocompleteState> {

  constructor() {
    super(...arguments);
    this.state = {
      menuIsOpen: false
    }
  }

  poetURL() {
    return '/profiles/autocomplete/' + this.props.value;
  }

  renderElement(profiles: ReadonlyArray<ProfileAutocompleteResource>) {
    const displayValue = this.getDisplayValue(profiles) || this.props.value;

    return (
      <Autocomplete
        wrapperProps={{className: 'autocomplete'}}
        items={profiles || []}
        value={displayValue}
        onSelect={(value: string, item: ProfileAutocompleteResource) => this.props.onSelect(value)}
        onChange={(event: any, value: string) => this.onChange(profiles, value)}
        getItemValue={(profile: ProfileAutocompleteResource) => profile.id}
        renderMenu={this.renderMenu}
        renderItem={this.renderProfile}
        inputProps={{className: classNames('input-text', this.state.menuIsOpen && 'open', this.props.className), placeholder: 'Attribute Name'}}
        onMenuVisibilityChange={(menuIsOpen: boolean) => this.setState({menuIsOpen})} />
    );
  }

  renderLoading() {
    return this.renderElement([]);
  }

  renderError() {
    console.error('Error loading profile autocomplete.');
    return this.renderElement([]);
  }

  private getDisplayValue(profiles: ReadonlyArray<ProfileAutocompleteResource>) {
    const profile = profiles && profiles.find((profile) => profile.id === this.props.value);
    return profile && profile.displayName;
  }

  private onChange = (profiles: ReadonlyArray<ProfileAutocompleteResource>, value: string) => {
    const profile = profiles && profiles.find((profile) => profile.displayName === value);
    this.props.onChange(profile ? profile.id : value);
  };

  private renderMenu = (children: any) => <ul className="menu">{children}</ul>;

  private renderProfile = (profile: ProfileAutocompleteResource, highlight: boolean) => {
    return (
      <li
        key={profile.id}
        id={profile.id}
        className={highlight ? 'blur' : ''}
      >{profile.displayName}</li>
    )
  }

}

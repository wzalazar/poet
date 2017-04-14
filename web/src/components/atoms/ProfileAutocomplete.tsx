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
  readonly placeholder?: string;
}

interface ProfileAutocompleteState {
  readonly menuIsOpen?: boolean;
}

export class ProfileAutocomplete extends PoetAPIResourceProvider<ReadonlyArray<ProfileAutocompleteResource>, ProfileAutocompleteProps, ProfileAutocompleteState> {
  private lastFetchedProfiles: ReadonlyArray<ProfileAutocompleteResource> = [];

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
    return (
      <Autocomplete
        wrapperProps={{className: 'autocomplete'}}
        items={profiles || []}
        value={this.getDisplayValue(profiles)}
        onSelect={(value: string, item: ProfileAutocompleteResource) => this.props.onSelect(value)}
        onChange={(event: any, value: string) => this.onChange(profiles, value)}
        getItemValue={(profile: ProfileAutocompleteResource) => profile.id}
        renderMenu={this.renderMenu}
        renderItem={this.renderProfile}
        inputProps={{className: classNames('input-text', this.state.menuIsOpen && 'open', this.props.className), placeholder: this.props.placeholder}}
        onMenuVisibilityChange={(menuIsOpen: boolean) => this.setState({menuIsOpen})} />
    );
  }

  renderLoading() {
    return this.renderElement(this.lastFetchedProfiles || []);
  }

  renderError() {
    return this.renderElement([]);
  }

  componentDidFetch(profiles: ReadonlyArray<ProfileAutocompleteResource>) {
    this.lastFetchedProfiles = profiles;
  }

  private getDisplayValue(profiles?: ReadonlyArray<ProfileAutocompleteResource>) {
    const allProfiles = [...(profiles || []), ...(this.lastFetchedProfiles || [])];
    const profile = allProfiles.find(_ => _.id === this.props.value);
    return profile ? profile.displayName : this.props.value;
  }

  private onChange = (profiles: ReadonlyArray<ProfileAutocompleteResource>, value: string) => {
    const profile = profiles && profiles.find(_ => _.displayName === value);
    this.props.onChange(profile ? profile.id : value);
  };

  private renderMenu = (children: React.ReactChildren) => <ul className="menu">{children}</ul>;

  private renderProfile = (profile: ProfileAutocompleteResource, highlight: boolean) => {
    const displayValue = this.getDisplayValue();

    const splits = profile.displayName.split(new RegExp(`(${displayValue})`, 'i'));
    const matchedItem = splits.map((s, i) => <span key={i} className={classNames(this.shouldItemRender(s, displayValue) && 'matched')}>{s}</span>);

    return (
      <li
        key={profile.id}
        id={profile.id}
        className={highlight ? 'blur' : ''}
      >{matchedItem}</li>
    )
  };

  private shouldItemRender = (item: string, value: string) => {
    return value && item.toLowerCase().includes(value.toLowerCase());
  }

}

import * as React from 'react';

import { Link } from 'react-router';
import { Profile, License } from './Interfaces';
import { PoetAPIResourceProvider } from './base/PoetApiResource';
import { SelectProfileById } from './Arguments';
import { timeFrom } from './Work';
import { Config } from '../config';
import moment = require('moment');

export class ProfileNameWithLink extends PoetAPIResourceProvider<Profile, SelectProfileById, undefined> {
  poetURL(): string {
    return '/profiles/' + this.props.profileId;
  }
  renderElement(resource: Profile): JSX.Element {
    return <Link to={"/profiles/" + resource.id}>{ resource.displayName || 'Anonymous' }</Link>
  }
}

export function LicenseOwnerNameWithLink(props: { license: License }) {
  return <ProfileNameWithLink profileId={props.license.licenseHolder.id} />
}

export function LicenseEmitterNameWithLink(props: { license: License }) {
  return <ProfileNameWithLink profileId={props.license.referenceOffering.owner} />
}

export function LicenseEmittedDate(props: { license: License }) {
  const publishDate = props.license
    && props.license.claimInfo
    && props.license.claimInfo.timestamp
  return (<span>{
    publishDate
      ? moment(publishDate * 1000).format(Config.dateTimeFormat)
      : '(pending timestamp on the blockchain)'
  }</span>)
}

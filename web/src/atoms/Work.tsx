import * as React from 'react';
import { Link } from 'react-router';

import * as moment from 'moment';

import { Config } from '../config';
import { PoetAPIResourceProvider } from './base/PoetApiResource';
import { Work, Profile } from './Interfaces';
import { SelectProfileOwnerOfWorkId } from './Arguments';
import { ProfileLink } from '../components/ProfileLink';

export class OwnerName extends PoetAPIResourceProvider<Profile, SelectProfileOwnerOfWorkId, undefined> {

  renderElement(resource: Profile): JSX.Element {
    return (<div>{this.props.resource.attributes.displayName}</div>);
  }

  poetURL() {
    return `/ownerOf/${this.props.work}`
  }
}

export function OwnerNameWithLink(props: { work: Work }) {
  return <Link to={'/profile/' + props.work.owner.publicKey}>
    { props.work.owner.attributes.displayName || 'Unknown Author' }
  </Link>
}

export function AuthorWithLink(props: { work: Work }) {
  if (props.work.attributes.authorPublicKey) {
    return <ProfileLink id={props.work.attributes.authorPublicKey} />
  }
  return <span>{ props.work.attributes.author || 'Unknown author' }</span>
}

export function WorkNameWithLink(props: { work: Work }) {
  return <Link to={'/works/' + props.work.id}>{props.work.attributes.name}</Link>
}

export function WorkName(props: { work: Work }) {
  return <span>{ props.work.attributes.name || '(untitled)' }</span>
}

export function WorkType(props: { work: Work }) {
  return <span> { props.work.attributes.type || '(unknown article type)' } </span>
}

export function WorkPublishedDate(props: { work: Work }) {
  const publishDate = props.work
    && props.work.attributes
    && props.work.attributes.publishedAt
  return (<span>{
    publishDate
      ? moment(publishDate).format(Config.dateFormat)
      : '(unknown publish date)'
  }</span>)
}

export function WorkCreationDateFromNow(props: { work: Work }) {
  const createdAt = props.work
    && props.work.attributes
    && props.work.attributes.createdAt
  return (<span>{
    createdAt
      ? moment(createdAt).fromNow()
      : '(unknown creation date)'
  }</span>)
}

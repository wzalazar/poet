import * as React from 'react';
import { Link } from 'react-router';

import * as moment from 'moment';

import { Config } from '../config';
import { PoetAPIResourceProvider } from './base/PoetApiResource';
import { Work, Profile } from './Interfaces';
import { SelectWorkById } from './Arguments';
import { ProfileLink } from '../components/ProfileLink';

export class OwnerName extends PoetAPIResourceProvider<Profile, SelectWorkById, undefined> {

  renderElement(resource: Profile): JSX.Element {
    return (<div>{resource.attributes.displayName}</div>);
  }

  poetURL() {
    return `/ownerOf/${this.props.workId}`
  }
}

export function OwnerNameWithLink(props: { work: Work }) {
  const publicKey = props.work && props.work.owner && props.work.owner.publicKey
  const authorName = props.work
    && props.work.owner
    && props.work.owner.attributes
    && props.work.owner.attributes.displayName
    || 'Unknown Author'
  if (!publicKey) {
    return <span>{ authorName }</span>
  }
  return <Link to={'/profile/' + publicKey}> { authorName }</Link>
}

export function AuthorWithLink(props: { work: Work }) {
  if (props.work.attributes.authorPublicKey) {
    return <ProfileLink id={props.work.attributes.authorPublicKey} />
  }
  return <span>{ props.work.attributes.author || 'Unknown author' }</span>
}

export function WorkNameWithLink(props: { work: Work }) {
  const title = props.work && props.work.attributes
    && props.work.attributes.name
    || '(untitled)'
  return <Link to={'/works/' + props.work.id}> { title }</Link>
}

export function WorkName(props: { work: Work }) {
  return <span>{ props.work.attributes.name || '(untitled)' }</span>
}

export class WorkNameById extends PoetAPIResourceProvider<Work, SelectWorkById, undefined> {

  renderElement(resource: Work): JSX.Element {
    const title = resource.attributes
      && resource.attributes.name
      || '(untitled)';
    return <span>{ title }</span>;
  }

  poetURL() {
    return `/works/${this.props.workId}`
  }
}

export function WorkType(props: { work: Work }) {
  return <span> { props.work.attributes.type || '' } </span>
}

export function WorkPublishedDate(props: { work: Work }) {
  const publishDate = props.work
    && props.work.attributes
    && props.work.attributes.publishedAt
  return (<span>{
    publishDate
      ? moment(publishDate).format(Config.dateFormat)
      : '(unknown publication date)'
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

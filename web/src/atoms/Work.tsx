import * as React from 'react';
import { Link } from 'react-router';

import * as moment from 'moment';

import { PoetAPIResourceProvider } from './base/PoetApiResource';
import { Work, Profile } from './Interfaces';
import { SelectWorkById } from './Arguments';
import { ProfileLink } from '../components/ProfileLink';

interface WorkProps {
  readonly work: Work;
}

abstract class ProfileByWorkOwner<State> extends PoetAPIResourceProvider<Profile, SelectWorkById, State> {
  poetURL() {
    return `/profiles/ownerOf/${this.props.workId}`
  }
}

export class OwnerName extends ProfileByWorkOwner<undefined> {
  renderElement(resource: Profile): JSX.Element {
    return (<span>{resource.attributes.displayName}</span>);
  }
}

abstract class WorkById<State> extends PoetAPIResourceProvider<Work, SelectWorkById, State> {
  poetURL() {
    return `/works/${this.props.workId}`
  }
}

export class WorkNameById extends WorkById<undefined> {
  renderElement(resource: Work): JSX.Element {
    const title = resource.attributes
      && resource.attributes.name
      || '(untitled)';
    return <span>{ title }</span>;
  }
}

export class WorkHashById extends WorkById<undefined> {
  renderElement(resource: Work): JSX.Element {
    const hash = resource.attributes
      && resource.attributes.contentHash
      || '(unknown)';
    return <span className="hash-long monospaced">{ hash }</span>;
  }
}

export function OwnerNameWithLink(props: WorkProps) {
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

export function AuthorWithLink(props: WorkProps) {
  if (props.work.attributes.authorPublicKey) {
    return <ProfileLink id={props.work.attributes.authorPublicKey} />
  }
  return <span>{ props.work.attributes.author || 'Unknown author' }</span>
}

export function WorkNameWithLink(props: WorkProps) {
  const title = props.work && props.work.attributes
    && props.work.attributes.name
    || '(untitled)'
  return <Link to={'/works/' + props.work.id}> { title }</Link>
}

export class WorkNameWithLinkById extends WorkById<undefined> {
  renderElement(work: Work): JSX.Element {
    return <WorkNameWithLink work={work} />
  }
}

export function WorkName(props: WorkProps) {
  return <span>{ props.work.attributes.name || '(untitled)' }</span>
}

export function WorkType(props: WorkProps) {
  return <span> { props.work.attributes.type || '' } </span>
}

export function normalizeToMillis(timestamp: number) {
  return timestamp < 5000000000 ? timestamp * 1000 : timestamp
}

export function timeFrom(timestamp: number) {
  return moment(normalizeToMillis(timestamp)).fromNow()
}

export function WorkPublishedDate(props: WorkProps) {
  const publishDate = props.work
    && props.work.attributes
    && props.work.attributes.datePublished
  return (<span>{
    publishDate
      ? timeFrom(-(-publishDate))
      : '(unknown publication date)'
  }</span>)
}

export function WorkStampedDate(props: WorkProps) {
  const timestamp = props.work
    && props.work.claimInfo
    && props.work.claimInfo.timestamp
  return (<span>{
    timestamp
      ? timeFrom(timestamp)
      : '(unknown certification date)'
  }</span>)
}

export function WorkCreationDateFromNow(props: WorkProps) {
  const createdAt = props.work
    && props.work.attributes
    && props.work.attributes.dateCreated
  return (<span>{
    createdAt
      ? timeFrom(-(-createdAt))
      : '(unknown creation date)'
  }</span>)
}

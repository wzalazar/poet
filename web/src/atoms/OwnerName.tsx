import * as React from 'react';
import { ResourceProvider, ResourceLocator } from '../components/ResourceProvider';
import Config from '../config';
import { PoetAPIResourceProvider } from './base/PoetApiResource';

interface Profile {
  readonly attributes: {
    displayName: string;
  }
}

interface SelectByWork {
  readonly work: string
}

export default class OwnerName extends PoetAPIResourceProvider<Profile, SelectByWork, undefined> {

  renderElement(resource: Profile): JSX.Element {
    return <div>{this.props.resource.attributes.displayName}</div>;
  }

  poetURL() {
    return `/ownerOf/${this.props.work}`
  }
}
import * as React from 'react';
import { ResourceProvider, ResourceLocator } from '../components/ResourceProvider';
import Config from '../config';

interface Profile {
  readonly attributes: {
    displayName: string;
  }
}

interface SelectByWork {
  readonly work: string
}

export default class OwnerName extends ResourceProvider<Profile, SelectByWork, undefined> {

  renderElement(resource: Profile): JSX.Element {
    return <div>{this.props.resource.attributes.displayName}</div>;
  }

  resourceLocator(): ResourceLocator {
    return { url: `${Config.api.explorer}/ownerOf/${this.props.work}` }
  }

}
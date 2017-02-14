import Config from '../../config';
import { ResourceProvider } from '../../components/ResourceProvider';

export abstract class PoetAPIResourceProvider<Resource, PropTypes, State> extends  ResourceProvider<Resource, PropTypes, State> {
  abstract poetURL(): string

  resourceLocator() {
    return { url: `${Config.api.explorer}${this.poetURL()}` }
  }
}

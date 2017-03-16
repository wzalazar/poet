import { Configuration } from '../../../configuration';
import { UrlObject, isUrlObject, urlObjectToUrl } from '../../../common';
import { ResourceProvider } from '../../ResourceProvider';

export abstract class PoetAPIResourceProvider<Resource, PropTypes, State> extends ResourceProvider<Resource, PropTypes, State> {
  abstract poetURL(): string | UrlObject

  resourceLocator() {
    const poetUrl = this.poetURL();

    if (!isUrlObject(poetUrl) && typeof poetUrl === 'string') {
      return { url: `${Configuration.api.explorer}${poetUrl}` }
    } else if (isUrlObject(poetUrl)) {
      return { url: `${Configuration.api.explorer}${urlObjectToUrl(poetUrl)}` }
    } else {
      throw new Error('poetURL must return a string | UrlObject.');
    }
  }
}

export const HEADER_X_TOTAL_COUNT = 'X-Total-Count';
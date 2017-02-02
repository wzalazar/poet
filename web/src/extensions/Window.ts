import { StoreCreator } from 'redux';
import * as isoFetch from 'isomorphic-fetch';

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: () => StoreCreator
    fetch: typeof isoFetch
  }

  const fetch: typeof window.fetch; // TODO: remove once https://github.com/Microsoft/TypeScript/pull/12493 is merged
}

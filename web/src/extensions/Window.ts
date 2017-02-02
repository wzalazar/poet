import { StoreCreator } from 'redux';

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: () => StoreCreator
    fetch: (url: string, object?: any) => any // TODO: remove once https://github.com/Microsoft/TypeScript/pull/12493 is merged
  }

  const fetch: typeof window.fetch; // TODO: remove once https://github.com/Microsoft/TypeScript/pull/12493 is merged
}

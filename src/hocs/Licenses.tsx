import Config from '../config';

import FetchComponent, { FetchComponentProps } from './FetchComponent'

export default FetchComponent.bind(null, function (props: FetchComponentProps) {
  return {
    url: `${Config.api.url}/licenses`
  };
});
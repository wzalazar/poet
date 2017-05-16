import { Work } from 'poet-js';

import { Configuration } from '../../configuration';

import FetchComponent from './FetchComponent';

export default FetchComponent.bind(null, (props: Work) => ({
  url: `${Configuration.api.explorer}/works/${props.id}`
}));
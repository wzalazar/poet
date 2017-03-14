import { Configuration } from '../configuration';

import FetchComponent from './FetchComponent';
import { Work } from '../atoms/Interfaces';

export default FetchComponent.bind(null, (props: Work) => ({
  url: `${Configuration.api.explorer}/works/${props.id}`
}));
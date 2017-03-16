import { Configuration } from '../../configuration';
import { Work } from '../../Interfaces';

import FetchComponent from './FetchComponent';

export default FetchComponent.bind(null, (props: Work) => ({
  url: `${Configuration.api.explorer}/works/${props.id}`
}));
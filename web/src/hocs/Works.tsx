import { Configuration } from '../configuration';
import FetchComponent from './FetchComponent';
import { Work } from '../atoms/Interfaces';

function propsToQueryString(props: Work): any {
  const searchable: string[] = ['author']; // TODO: Object.keys(props).filter(...).map(...), but we can'd do this on WorkProps since it extends from FetchComponentProps

  const queryParams = searchable
    .filter(key => props.attributes && props.attributes[key])
    .map(key => `${key}=${props.attributes[key]}`);

  return queryParams.join('&');
}

export default FetchComponent.bind(null, function (props: Work) {
  const queryString = propsToQueryString(props);
  return {
    url: `${Configuration.api.explorer}/works?${queryString}`
  };
});
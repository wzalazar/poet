import Config from '../config';

import { HexString } from '../common'
import FetchComponent, { FetchComponentProps } from './FetchComponent'

export interface ProfileProps extends FetchComponentProps {
  id: HexString;
  name: string;
}

export default FetchComponent.bind(null, (props: ProfileProps) => ({
  url: `${Config.api.url}/profiles/${props.id}`
}));
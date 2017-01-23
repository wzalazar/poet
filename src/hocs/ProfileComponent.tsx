import Config from '../config';

import { HexString } from '../common'
import FetchComponent, { FetchComponentProps } from './FetchComponent'

export interface ProfileProps extends FetchComponentProps {
  id: HexString;
  name: string;
  picture: string;
  publicKey: HexString;
  bio: string;
  contacts: any;
  organizations: string[]; // TODO: TBD
}

export default FetchComponent.bind(null, (props: ProfileProps) => ({
  url: `${Config.api.explorer}/profiles/${props.id}`
}));
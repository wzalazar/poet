/**
 * TODO: use PoetApiResource instead of FetchComponent, move to atoms
 */

import { Configuration } from '../../configuration';

import { HexString } from '../../common'
import FetchComponent, { FetchComponentProps } from './FetchComponent'

export interface ProfileProps extends FetchComponentProps {
  id: HexString;
  claim: any;
  attributes: any;
}

export default FetchComponent.bind(null, (props: ProfileProps) => ({
  url: `${Configuration.api.explorer}/profiles/${props.id}`
}));
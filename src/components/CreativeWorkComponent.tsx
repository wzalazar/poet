import Config from '../config';

import { HexString } from '../common'
import FetchComponent, { FetchComponentProps } from './FetchComponent'

export interface CreativeWorkProps extends FetchComponentProps {
  id: HexString
  publicKey: HexString
  signature: HexString
  attributes: any
}

export default FetchComponent.bind(null, (props: any) => ({
  url: `${Config.api.url}/creative_works/${props.id}`
}));
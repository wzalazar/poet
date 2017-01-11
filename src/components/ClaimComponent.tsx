import { HexString } from '../common'
import FetchComponent, { FetchComponentProps } from './FetchComponent'

export interface ClaimProps extends FetchComponentProps {
  id: HexString
  publicKey: HexString
  signature: HexString
  attributes: any
}

export default FetchComponent.bind(null, (props: any) => ({
  url: `http://localhost:4000/claims/${props.id}` // TODO: hard-coded reference to localhost:4000
}));
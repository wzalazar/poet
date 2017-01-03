import { ResourceProps, ApiResource } from './apiResource'
import { HexString } from '../common'

export interface ClaimProps extends ResourceProps {
  error: any
  loading: any
  id: HexString
  publicKey: HexString
  signature: HexString
  attributes: any
}

export abstract class ClaimComponent extends ApiResource<ClaimProps, undefined> {
  apiPath = '/claim/' + this.props.id
}

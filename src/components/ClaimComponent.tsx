import { ResourceProps, ApiResource } from './ApiResource'
import { HexString } from '../common'

export interface ClaimProps {
  error: any
  loading: any
  id: HexString
  publicKey: HexString
  signature: HexString
  attributes: any
}

export abstract class ClaimComponent extends ApiResource<ClaimProps, undefined> {
  apiPath = '/claim/' + this.props.result.id
}

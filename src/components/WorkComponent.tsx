import Config from '../config';

import { HexString } from '../common'
import FetchComponent, { FetchComponentProps } from './FetchComponent'

export interface WorkProps extends FetchComponentProps {
  id: HexString
  publicKey: HexString
  signature: HexString

  name: string;
  author: string;
  published: Date;
  lastModified: Date;
  customLabel: string;
  tags: string[];
  type: string;

  content: string;

  attributes: any;

  title: {
    owner: string,
    typeOfOwnership: string,
    status: string
  }

}

export default FetchComponent.bind(null, (props: WorkProps) => ({
  url: `${Config.api.url}/works/${props.id}`
}));
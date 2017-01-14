import Config from '../config';

import { HexString } from '../common'
import FetchComponent, { FetchComponentProps } from './FetchComponent'
import { WorkProps } from './WorkComponent';

// TODO: FetchManyComponent,
// export interface FetchManyProps<ElementProps, Query> extends FetchProps { elements: ElementProps[], query: Query }

export default FetchComponent.bind(null, (props: WorkProps) => ({
  url: `${Config.api.url}/works?author=${props.author}`
}));
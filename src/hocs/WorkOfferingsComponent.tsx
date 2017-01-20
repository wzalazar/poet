import Config from '../config';

import { HexString } from '../common'
import FetchComponent, { FetchComponentProps } from './FetchComponent'

export interface Price {
  amount: number;
  currency: string;
}

export interface WorkOfferingProps {
  id: HexString;

  price: Price;
  description: string;
  type: string;

  licenses: [{
    workId: HexString;
    publisher: string;
    url: string;
  }]

}

export interface WorkOfferingsProps extends FetchComponentProps {
  workId: HexString;

  workOfferings: WorkOfferingProps[]
}

export default FetchComponent.bind(null, (props: WorkOfferingsProps) => ({
  url: `${Config.api.explorer}/works/${props.workId}/offerings`
}));
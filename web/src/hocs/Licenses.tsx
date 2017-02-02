import Config from '../config';

import FetchComponent, { FetchComponentProps } from './FetchComponent'

export interface LicensesProps extends FetchComponentProps {
  readonly publicKey?: string;
  readonly licenses?: ReadonlyArray<any>;
}

export const Licenses = FetchComponent.bind(null, function (props: LicensesProps) {
  return {
    url: `${Config.api.explorer}/profiles/${props.publicKey}`
  };
});
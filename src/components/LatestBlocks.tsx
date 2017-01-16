import * as React from 'react';

import '../extensions/String';

import Config from '../config';

import { HexString } from '../common'
import FetchComponent, { FetchComponentProps } from './FetchComponent'

function renderBlock(props: any) {
  return (
    <tr key={props.id}>
      <td><span className="text-truncate">{props.id.firstAndLastCharacters(6)}</span></td>
      <td><span className="text-truncate">{props.bitcoinBlock.firstAndLastCharacters(6)}</span></td>
      <td>{props.timestamp}</td>
    </tr>
  )
}

function render(props: FetchComponentProps) {
  return (
    <table className="table table-hover">
      <tbody>
      { props.elements.map(renderBlock) }
      </tbody>
    </table>
  )
}

export interface LatestBlocksProps extends FetchComponentProps {
}

function propsToUrl(props: LatestBlocksProps) {
  return {
    url: `${Config.api.url}/blocks`
  }
}

export default FetchComponent(propsToUrl, render);
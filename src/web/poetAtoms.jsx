import * as React from 'react'

import { Link } from 'react-router'
import { ApiValueFromRoute, ApiValue } from './atoms'

export const OwnerNameWithLink = ApiValue('ownerFor',
  (result, props) => {
    return (<Link to={`/claim/${result.id}`}>
      { result.attributes.name }
    </Link>)
  }
)

export const ClaimRow = row => {
  return (<div>
    <h4> {row.type} <Link to={`/claim/${row.id}`}> {row.id}: { row.attributes.name } </Link> </h4>
  </div>)
}

export const IssuerNameWithLink = ApiValue('issuerFor',
  (result, props) => {
    return (<Link to={`/claim/${result.id}`}>
      { result.attributes.name }
    </Link>)
  }
)

export const CreativeWorkWithLink = ApiValue('claim',
  (result, props) => {
    return (<Link to={`/claim/${result.id}`}>
      { result.attributes.name }
    </Link>)
  }
)
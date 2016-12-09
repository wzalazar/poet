import { update } from '../common'

export default function(state, action) {
  switch (action.type) {
    case 'searching':
      return update(state, { loading: true })
    case 'search result':
      return update(state, { loading: false, result: action.payload })
    case 'search error':
      return update(state, { loading: false, error: action.payload })
    default:
      return state || {}
  }
}

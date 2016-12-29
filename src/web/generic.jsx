import { update } from './common'

const MARK_LOADING = 'mark loading '
const SET_RESULT = 'set result '
const ERRORED = 'error for '
const CLEAR = 'clear for '

export function updateLeave(root, path, updateValue) {
  return Object.assign({}, root, { [path]: updateValue })
}

const types = [CLEAR, MARK_LOADING, SET_RESULT, ERRORED]

function secondSpacePosition(str) {
  return str.indexOf(' ', str.indexOf(' ') + 1)
}

function findPath(str) {
  return str.slice(secondSpacePosition(str) + 1)
}

function getActionType(str) {
  for (let type of types) {
    if (str.indexOf(type) === 0) {
      return type
    }
  }
}

export default function(store, action) {
  let newValue
  const match = getActionType(action.type)
  switch(match) {
    case CLEAR:
      newValue = { result: null }
      break
    case MARK_LOADING:
      newValue = { loading: true }
      break
    case SET_RESULT:
      newValue = { loading: false, result: action.payload }
      break
    case ERRORED:
      newValue = { loading: false, error: action.payload }
      break
    default:
      if (action.type === 'discovered') {
        return updateLeave(store, 'all_blocks', { result: null })
      }
      return store || {}
  }
  const leavePath = findPath(action.type)
  return updateLeave(store, leavePath, newValue)
}
import { default as SocketIO } from 'socket.io-client'

export const Connected = 'Socket connected'
export const Disconnected = 'Socket disconnected'

export const BlockState = 'blockstate'
export const Discovered = 'discovered'
export const Reorg = 'reorg'
export const BlockFound = 'blockfound'
export const Downloaded = 'downloaded'

function update() {
  return Object.assign.apply({}, arguments)
}

function insertToSet(set, element) {
  if (set.indexOf(element) === -1) {
    return Array.prototype.concat.call([], set, [element])
  }
  return set
}

export function connectionReducer(store, action) {
  switch (action.type) {
    case Connected:
      return update(store, { socket: action.payload })
    case Discovered:
      return update(store, {
        knownBlockHashes: insertToSet(store.knownHashes || [], action.payload)
      })
    case BlockState:
      return update(store, {
        bitcoinBlockState: action.payload
      })
    case Reorg:
      if (action.payload.length) {
        return update(store, {
          bitcoinLastReorg: action.payload
        })
      }
    case Downloaded:
      return update(store, {
        blockData: update(store.blockData, {
          [action.payload.hash]: action.payload.block
        })
      })
    default:
      break
  }
  return store || {}
}

export function connectStoreToEvents(store) {
  const io = SocketIO()
  io.on('connect', () => {
    store.dispatch({ type: Connected, payload: io })
  })
  io.on('disconnect', () => {
    store.dispatch({ type: Disconnected })
  })
  io.on('poet discovered', (data) => {
    store.dispatch({ type: Discovered, payload: data })
  })
  io.on('blockstate', (data) => {
    store.dispatch({ type: BlockState, payload: data })
  })
  io.on('reorg', (data) => {
    store.dispatch({ type: Reorg, payload: data  })
  })
  io.on('blockfound', (data) => {
    store.dispatch({ type: BlockFound, payload: data })
  })
  io.on('downloaded', (data) => {
    store.dispatch({ type: Downloaded, payload: data })
  })
  return store
}
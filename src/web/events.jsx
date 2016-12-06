import { default as SocketIO } from 'socket.io-client'

export const Connected = 'Socket connected'
export const Disconnected = 'Socket disconnected'

export function connectStoreToEvents(store) {
  const io = SocketIO()
  io.on('connect', () => {
    store.dispatch({ type: Connected })
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
  io.on('reorg', () => {
    store.dispatch({ type: Reorg })
  })
  io.on('blockfound', () => {
    store.dispatch({ type: BlockFound })
  })
  io.on('downloaded', () => {
    store.dispatch({ type: Downloaded })
  })
  return store
}
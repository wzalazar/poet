import { default as SocketIO } from 'socket.io-client'

export const Connected = 'Socket connected'
export const Message = 'Connection message'
export const Disconnected = 'Socket disconnected'

export function connectStoreToEvents(store) {
  const io = SocketIO()
  io.on('connect', () => {
    store.dispatch({ type: Connected })
  })
  io.on('message', (data) => {
    store.dispatch({ type: Message, payload: data })
  })
  io.on('disconnect', () => {
    store.dispatch({ type: Disconnected })
  })
  return store
}
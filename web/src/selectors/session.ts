import { PoetAppState } from '../store/PoetAppState'

export function currentPublicKey(state: PoetAppState): string {
  return state.session && state.session.token && state.session.token.publicKey;
}
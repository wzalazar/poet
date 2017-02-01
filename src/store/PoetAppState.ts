export interface PoetSessionToken {
  publicKey: string
  message: string
  signature: string
}

export interface PoetSession {
  token: PoetSessionToken
  publicKey: string
}

export interface PoetAppState {
  session: PoetSession
}

export default PoetAppState;

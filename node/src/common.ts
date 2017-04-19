import * as fs from 'fs'

const bitcore = require('bitcore-lib')

export const BARD = new Buffer('BARD')
export const VERSION = new Buffer([0, 0, 0, 2])

export async function delay(millis: number) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, millis)
  })
}

export function assert(value: boolean, message: string) {
  if (!value) {
    throw new Error(message)
  }
}

export function sha256(value: string | Uint8Array) {
  return bitcore.crypto.Hash.sha256(
    typeof value === 'string'
    ? new Buffer(value)
    : value
  )
}

export function sign(privateKey: string, value: Uint8Array): Uint8Array {
  const signature =  bitcore.crypto.ECDSA.sign(
    value,
    new bitcore.PrivateKey(privateKey)
  )
  return signature.toBuffer()
}

export function verify(publicKey: any, signature: Uint8Array, value: Uint8Array): Boolean {
  return bitcore.crypto.ECDSA.verify(
    value,
    bitcore.crypto.Signature.fromBuffer(signature),
    publicKey
  )
}

export function hex(buffer: Buffer | Uint8Array): string {
  return buffer instanceof Buffer
    ? buffer.toString('hex')
    : (buffer as Buffer).toString('hex')
}

export function noop() {}

export function readdir(dirname: string): Promise<string[]> {
  return new Promise((resolve, reject) => {
    fs.readdir(dirname, (error, result: string[]) => {
      if (error)  {
        return reject(error)
      }
      return resolve(result)
    })
  })
}

export function zip<A, B, R>(a: A[], b: B[], iterator: (a: A, b: B) => R): R[] {
  const length = a.length
  assert(a.length === b.length, 'Arrays should be of the same size')
  const results = []
  for (let i = 0; i < length; i++) {
    results.push(iterator(a[i], b[i]))
  }
  return results
}

export const HEXA = new RegExp('^[a-fA-F0-9]+$', 'gi')

export function looksLikePublicKey(key: string) {
  if (!key) {
    return false
  }
  if (key.length !== 66) {
    return false
  }
  if (!HEXA.exec(key)) {
    return false
  }
  if (key[0] !== '0' && (key[1] !== '2' || key[1] !== '3')) {
    return false
  }
  return true
}

import * as fs from 'fs'

const bitcore = require('bitcore-lib')

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
  return bitcore.crypto.ECDSA.sign(
    value,
    new bitcore.PrivateKey(privateKey)
  ).toBuffer()
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

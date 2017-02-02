import { verify, sha256, sign } from '../common'
const bitcore = require('bitcore-lib')

export function doubleSha(data: Buffer) {
  return bitcore.crypto.Hash.sha256sha256(data)
}

export function verifies(hashFn: any, encoded: Buffer, signature: string, publicKey: string) {
  if (!encoded || !signature || !publicKey) {
    return false
  }

  if (!verify(
      new bitcore.PublicKey(publicKey),
      new Buffer(signature, 'hex'),
      hashFn(encoded)))
  {
    console.log('Signature is invalid')
    return false
  }
  return true
}

export function signMessage(bitcoin: boolean, key: any /* TODO: TYPE: PrivateKey */, message: string) {
  const hash = bitcoin ? doubleSha : sha256
  const msg = new Buffer(message, 'hex')
  const signature = sign(key, hash(msg)) as any

  return {
    message: message,
    publicKey: key.publicKey.toString(),
    signature: signature.toString('hex'),
  }
}

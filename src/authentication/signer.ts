import * as fetch from 'isomorphic-fetch'
import { sign, sha256 } from '../common'
const bitcore = require('bitcore-lib')

const key = bitcore.PrivateKey()
const id = process.argv[2]

function doubleShaAndReverse(data: Buffer) {
  const doubleSha = bitcore.crypto.Hash.sha256sha256(data);
  const read = new bitcore.encoding.BufferReader(doubleSha).readReverse();
  return read
}

function signMessage(bitcoin: boolean, message: string) {
  const hash = bitcoin ? doubleShaAndReverse : sha256
  const signature = sign(key, hash(new Buffer(message, 'hex'))) as any

  return {
    message: message,
    publicKey: key.publicKey.toString(),
    signature: signature.toString('hex'),
  }
}

async function accept(id: string) {
  const body = await fetch('http://localhost:5000/request/' + id).then(res => res.json()) as any
  const signFunc = signMessage.bind(null, body.bitcoin)

  const result = body.multiple
    ? body.message.map(signFunc)
    : signFunc(body.message)
  console.log('result is', result)
  const endpoint = body.multiple ? 'multiple': 'request'

  await fetch(`http://localhost:5000/${endpoint}/${id}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(result)
  }).then(async (res) => {
    console.log(await res.text())
  })
}

accept(id).catch(error => console.log(error))

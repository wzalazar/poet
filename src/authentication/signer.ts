import * as fetch from 'isomorphic-fetch'
import { sign, sha256 } from '../common'
const bitcore = require('bitcore-lib')

const key = bitcore.PrivateKey()
const id = process.argv[2]

async function accept(id: string) {
  const body = await fetch('http://localhost:3000/request/' + id).then(res => res.text())
  console.log('Signing', body)

  const encodedHash = sha256(body).toString('hex')
  const timestamp = new Date().getTime()
  const accept = true
  const extra = ''

  const signed = JSON.stringify({
    encodedHash,
    timestamp,
    accept,
    extra
  })
  const signature = sign(key, sha256(signed)) as any

  const response = {
    publicKey: key.publicKey.toString(),
    signature: signature.toString('hex'),
    message: signed
  }

  console.log(JSON.stringify(response))

  await fetch('http://localhost:3000/request/' + id, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(response)
  }).then(async (res) => {
    console.log(await res.text())
  })
}

accept(id).catch(error => console.log(error))

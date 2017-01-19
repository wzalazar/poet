import * as fetch from "isomorphic-fetch"
import { default as getCreator } from "../src/serialization/builder"
import Fields from '../src/blockchain/fields'
import { Claim } from '../src/claim'

const myPrivateKey = '2461d5dc1bf2c48b73d271375a11f853f92aca53d328f35af5cbaead016ebeb5'

const bitcore = require('bitcore-lib')
const privateKey = new bitcore.PrivateKey(myPrivateKey)
const publicKey = privateKey.publicKey

export default async function create() {
  const host = 'localhost'
  const port = 3000

  const creator = await getCreator()

  const create = (data: any) => creator.createSignedClaim(data, myPrivateKey)
  const publish = async(claim: Claim) => {
    const response = await fetch(`http://${host}:${port}/claim`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(claim)
    })
    console.log('published', await response.text())
  }

  const work = create({
    type: 'Work',
    attributes: {
      name: 'La Gioconda VV',
      createdOn: '2016-11-31 00:00:00.000Z',
      param: process.argv[2]
    }
  })
  await publish(work)

  const title = create({
    type: 'Title',
    attributes: {
      [Fields.REFERENCE]: work.id,
      [Fields.OWNER_KEY]: publicKey.toString()
    }
  })
  await publish(title)
}

if (!module.parent) {
  create().catch(error => {
    console.log(error, error.stack)
  })
}

import * as fetch from 'isomorphic-fetch'
import { default as getCreator } from "../systems/creator"
import * as builders from "../model/loaders"

const myPrivateKey = '2461d5dc1bf2c48b73d271375a11f853f92aca53d328f35af5cbaead016ebeb5'

export default async function create() {
  const host = 'localhost'
  const port = 3000

  const creator = await getCreator()

  const claim = creator.createSignedClaim({
    type: 'CreativeWork',
    attributes: {
      name: 'Gioconda',
      createdOn: '2016-12-31 00:00:00.000Z'
    }
  }, myPrivateKey)

  console.log(claim)

  const response = await fetch(`http://${host}:${port}/claim`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(claim)
  })

  console.log(response.body)
}

if (!module.parent) {
  create().catch(error => {
    console.log(error, error.stack)
  })
}
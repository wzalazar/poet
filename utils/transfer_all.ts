import * as fs from 'fs'

import * as moment from 'moment'
import * as xml2js from 'xml2js'
const fetch = require('isomorphic-fetch')

import { getBuilder } from './poetlib/serialization/builder'
import * as common from './poetlib/common'

declare var require: any

const bitcore = require('bitcore-lib')

const targetURL = 'https://bitcoinmagazine.com/feed/'
const explorerURL = 'https://alpha.po.et/api/explorer'
const publisherURL = 'https://alpha.po.et/api/user'

const prevKey = '4cbfeb0cbfa891148988a50b549c42309e088a7839dd14ab480f542286725d3a'
const newKey = '4649668598abd60749e10f54cf77c0f4ee5a315ae01117cca0831100a0311a04'

const btcmediaPrivkey = bitcore.PrivateKey(prevKey)
const btcmediaPubkey = btcmediaPrivkey.publicKey.toString()

const btcmediaNewpriv = bitcore.PrivateKey(newKey)
const btcmediaNewpub = btcmediaNewpriv.publicKey.toString()

export interface Transfer {
  currentOwner: string
  reference: string
  owner: string
}

export function fetchAllBTC(): Promise<any> {
  return fetch(`${explorerURL}/works?owner=${btcmediaPubkey}`)
    .then((res: any) => res.json())
}

export async function transferArticles(ids: string[], prevOwner: string, newOwner: string) {
  const builder = await getBuilder()
  const signedClaims = ids.map(id => {
    const data = {
      type: 'Title',
      attributes: {
        currentOwner: prevOwner,
        reference: id,
        owner: newOwner
      }
    }
    const message = builder.getEncodedForSigning(data, btcmediaPrivkey)
    const claimId = builder.getId(data, btcmediaPrivkey)
    const signature = common.sign(btcmediaPrivkey, claimId)
    return {
      message: new Buffer(new Buffer(message).toString('hex')).toString('hex'),
      signature: new Buffer(signature).toString('hex')
    }
  })
  return signedClaims
}

export async function postClaims(claims: any) {
  return fetch(`${publisherURL}/claims`, {
    method: 'POST',
    headers: {
      'content-type': 'text/plain'
    },
    body: JSON.stringify({ signatures: claims })
  }).then((body: any) => {
    return body.text()
  }).then(body => {
    return JSON.parse(body).createdClaims.filter((e: any) => e.type === 'Work')
  }).catch(err => {
    console.log(err, err.stack)
  })
}

if (!module.parent) {
  fetchAllBTC().then(async (btc) => {
    const ids = btc.map(b => b.id)
    console.log(ids)
    const signedClaims = await transferArticles(ids, btcmediaPubkey, btcmediaNewpub)
    return await postClaims(signedClaims)
  }).catch(err => console.log(err))
}

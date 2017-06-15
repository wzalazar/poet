import * as fs from 'fs'

import * as fetch from 'isomorphic-fetch'
import * as moment from 'moment'
import * as xml2js from 'xml2js'

import { getBuilder } from './poetlib/serialization/builder'
import * as common from './poetlib/common'

declare var require: any

const bitcore = require('bitcore-lib')

const targetURL = 'https://bitcoinmagazine.com/feed/'
const explorerURL = 'https://poet.host/api/explorer'
const publisherURL = 'https://poet.host/api/user'

const rawKey = '4649668598abd60749e10f54cf77c0f4ee5a315ae01117cca0831100a0311a04'

const btcmediaPrivkey = bitcore.PrivateKey(rawKey)
const btcmediaPubkey = btcmediaPrivkey.publicKey.toString()

export interface Article {
  id: string
  link: string
  content: string
  author: string
  tags: string
  mediaType: string
  articleType: string
  name: string
  datePublished: string
}

export async function normalizeContent(article: any): Promise<string> {
  const content = await new Promise((resolve, reject) => {
    return xml2js.parseString(article, (err, res) => {
      if (err) {
        return reject(err)
      }
      return resolve(res)
    })
  })

  return (content as any).article._
    .replace(/<(\/)?p>/gi, '\n')
    .replace(/<br\/>/gi,   '\n')
    .replace(/<[^>]+>/gi,  '')
}

export function getContent(article: any): string {
  const builder = new xml2js.Builder({ rootName: 'article' })
  return builder.buildObject(article.CONTENT[0])
}

export function getAuthor(article: any): string {
  return article.AUTHOR.length > 1 ? article.AUTHOR.join(', ') : article.AUTHOR[0]
}

export function getTags(article: any): string {
  return article.CATEGORY.join(',')
}

export function getTitle(article: any): string {
  return article.TITLE[0]
}

export function getPublicationDate(article: any): string {
  return '' + moment(article.PUBDATE[0]).toDate().getTime()
}

export function getId(article: any): string {
  return article.GUID[0]
}

export function getLink(article: any): string {
  return article.LINK[0]
}

export async function processItem(article: any): Promise<Article> {
  const content = await normalizeContent(getContent(article))
  return {
    id: getId(article),
    link: getLink(article),
    content: content,
    author: getAuthor(article),
    tags: getTags(article),
    name: getTitle(article),
    mediaType: 'article',
    articleType: 'news-article',
    datePublished: getPublicationDate(article)
  }
}

export async function mapProcessItem(items: any[]): Promise<Article[]> {
  const result = []
  for (const item of items) {
    result.push(await processItem(item))
  }
  return result
}

export async function process(xmlResponse: any): Promise<Article[]> {
  const items = await new Promise(function(resolve, reject) {
    xmlResponse.text().then((body: any) =>
      xml2js.parseString(body, { strict: false }, function(err, res) {
        if (err) {
          console.log(err)
          return reject(err)
        }
        return resolve(res.RSS.CHANNEL[0].ITEM)
      })
    )
  })
  return await mapProcessItem(items as any[])
}

export async function scanBTCMagazine(): Promise<any> {
  fetch(targetURL).then(process).then(async (results) => {
    try {
      const newArticles = []
      for (let article of results) {
        if (!(await exists(article))) {
          newArticles.push(article)
        }
      }
      const submitedArticles = (await submitArticles(newArticles)) as any
      const submitedLicenses = await submitLicenses(submitedArticles)
    } catch (err) {
      console.log(err, err.stack)
    }
  })
}

export function exists(article: Article): Promise<boolean> {
  return fetch(`${explorerURL}/works?attribute=id<>${article.id}&owner=${btcmediaPubkey}`)
    .then(res => res.json())
    .then(res => (res as any).length !== 0)
}

export async function submitArticles(articles: Article[]) {
  const builder = await getBuilder()
  const signedClaims = articles.map(article => {
    const data = {
      type: 'Work',
      attributes: article
    }
    const message = builder.getEncodedForSigning(data, btcmediaPrivkey)
    const id = builder.getId(data, btcmediaPrivkey)
    const signature = common.sign(btcmediaPrivkey, id)
    return {
      message: new Buffer(new Buffer(message).toString('hex')).toString('hex'),
      signature: new Buffer(signature).toString('hex')
    }
  })
  return await postClaims(signedClaims)
}

export async function submitLicenses(articles: any[]) {
  const builder = await getBuilder()
  const signedClaims = articles.map(article => {
    const data = {
      type: 'License',
      attributes: {
        reference: article.id,
        licenseHolder: btcmediaPubkey,
        licenseEmitter: btcmediaPubkey,
        referenceOwner: btcmediaPubkey,
        proofType: 'LicenseOwner',
      }
    }
    const message = builder.getEncodedForSigning(data, btcmediaPrivkey)
    const id = builder.getId(data, btcmediaPrivkey)
    const signature = common.sign(btcmediaPrivkey, id)
    return {
      message: new Buffer(new Buffer(message).toString('hex')).toString('hex'),
      signature: new Buffer(signature).toString('hex')
    }
  })
  return await postClaims(signedClaims)
}

export async function postClaims(claims: any) {
  return fetch(`${publisherURL}/claims`, {
    method: 'POST',
    headers: {
      'content-type': 'text/plain'
    },
    body: JSON.stringify({ signatures: claims })
  }).then(body => {
    return body.text()
  }).then(body => {
    return JSON.parse(body).createdClaims.filter((e: any) => e.type === 'Work')
  }).catch(err => {
    console.log(err, err.stack)
  })
}

export async function postProfile() {
  const profile = {
    displayName: "BTCMedia",
    firstName: "BTC",
    imageData: fs.readFileSync('./avatar.urlimage').toString(),
    lastName: "Media"
  }
  const data = {
    type: 'Profile',
    attributes: profile
  }
  const builder = await getBuilder()
  const message = builder.getEncodedForSigning(data, btcmediaPrivkey)
  const id = builder.getId(data, btcmediaPrivkey)
  const signature = common.sign(btcmediaPrivkey, id)
  return await postClaims([{
    message: new Buffer(new Buffer(message).toString('hex')).toString('hex'),
    signature: new Buffer(signature).toString('hex')
  }])
}

if (!module.parent) {
  postProfile()
  scanBTCMagazine()
}

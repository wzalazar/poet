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

const rawKey = '4cbfeb0cbfa891148988a50b549c42309e088a7839dd14ab480f542286725d3a'

const btcmediaPrivkey = bitcore.PrivateKey(rawKey)
const btcmediaPubkey = btcmediaPrivkey.publicKey.toString()

interface Article {
  id: string
  link: string
  content: string
  author: string
  tags: string
  mediaType: string
  articleType: string
  name: string
  publicationDate: string
}

function getContent(article: any): string {
  const builder = new xml2js.Builder({ rootName: 'article' })
  return builder.buildObject(article.CONTENT[0])
}

function getAuthor(article: any): string {
  return article.AUTHOR.length > 1 ? article.AUTHOR.join(', ') : article.AUTHOR[0]
}

function getTags(article: any): string {
  return article.CATEGORY.join(',')
}

function getTitle(article: any): string {
  return article.TITLE[0]
}

function getPublicationDate(article: any): string {
  return '' + moment(article.PUBDATE[0]).toDate().getTime()
}

function getId(article: any): string {
  return article.GUID[0]
}

function getLink(article: any): string {
  return article.LINK[0]
}

function processItem(article: any): Article {
  return {
    id: getId(article),
    link: getLink(article),
    content: getContent(article),
    author: getAuthor(article),
    tags: getTags(article),
    name: getTitle(article),
    mediaType: 'article',
    articleType: 'news-article',
    publicationDate: getPublicationDate(article)
  }
}

async function process(xmlResponse: any): Promise<Article[]> {
  const items = await new Promise(function(resolve, reject) {
    xmlResponse.text().then((body: any) =>
      xml2js.parseString(body, { strict: false }, function(err, res) {
        if (err) {
          console.log(err)
          return reject(err)
        }
        console.log(res.RSS.CHANNEL)
        return resolve(res.RSS.CHANNEL[0].ITEM)
      })
    )
  })
  return (items as any[]).map(processItem)
}

async function scanBTCMagazine(): Promise<any> {
  fetch(targetURL).then(process).then(async (results) => {
    try {
      const newArticles = []
      for (let article of results) {
        if (!(await exists(article))) {
          newArticles.push(article)
        }
      }
      await submitArticles(newArticles)
    } catch (err) {
      console.log(err, err.stack)
    }
  })
}

function exists(article: Article): Promise<boolean> {
  return fetch(`${explorerURL}/works?attribute=id<>${article.id}&owner=${btcmediaPubkey}`)
    .then(res => res.json())
    .then(res => (res as any).length !== 0)
}

async function submitArticles(articles: Article[]) {
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

async function postClaims(claims: any) {
  return fetch(`${publisherURL}/claims`, {
    method: 'POST',
    headers: {
      'content-type': 'text/plain'
    },
    body: JSON.stringify({ signatures: claims })
  }).then(body => {
    return body.text()
  }).then(body => {
    console.log(body.substr(0, 100) + '...')
  }).catch(err => {
    console.log(err, err.stack)
  })
}

async function postProfile() {
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

postProfile()

scanBTCMagazine()

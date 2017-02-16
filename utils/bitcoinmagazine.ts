import * as fetch from 'isomorphic-fetch'
import * as moment from 'moment'
import * as xml2js from 'xml2js'

const targetURL = 'https://bitcoinmagazine.com/feed/'

interface Article {
  id: string
  link: string
  content: string
  author: string
  tags: string
  title: string
  publicationDate: string
}

function getContent(article: any): string {
  const builder = new xml2js.Builder({ rootName: 'article' })
  return builder.buildObject(article.content[0])
}

function getAuthor(article: any): string {
  return article.author.length > 1 ? article.author.join(', ') : article.author[0]
}

function getTags(article: any): string {
  return article.category.join(',')
}

function getTitle(article: any): string {
  return article.title[0]
}

function getPublicationDate(article: any): string {
  return '' + moment(article.pubDate[0]).toDate().getTime()
}

function getId(article: any): string {
  return article.guid[0]
}

function getLink(article: any): string {
  return article.link[0]
}

function processItem(article: any): Article {
  return {
    id: getId(article),
    link: getLink(article),
    content: getContent(article),
    author: getAuthor(article),
    tags: getTags(article),
    title: getTitle(article),
    publicationDate: getPublicationDate(article)
  }
}

async function process(xmlResponse: any): Promise<Article[]> {
  const items = await new Promise(function(resolve, reject) {
    xmlResponse.text().then((body: any) =>
      xml2js.parseString(body, function(err, res) {
        if (err) {
          return reject(err)
        }
        return resolve(res.rss.channel[0].item)
      })
    )
  })
  return (items as any[]).map(processItem)
}

function scanBTCMagazine(): any {
  fetch(targetURL).then(process).then(res => console.log(res))
}

scanBTCMagazine()

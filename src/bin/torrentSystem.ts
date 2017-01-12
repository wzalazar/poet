import * as fs from 'fs'
import * as WebTorrent from 'webtorrent'
import * as Rx from 'rx'

import { PoetBlock } from '../model/claim'
import { default as getBuilder } from '../model/builder'
import * as queues from '../queues'
import { consume, publish } from '../helpers/pubsub'
import { getCreateOpts, getHash  } from '../helpers/torrentHash'
import { noop } from '../common'

function makePath(id: string) {
  return './torrents/' + id
}

export default async function startTorrents() {

  const client = new WebTorrent()
  client.on('error', (error: any) => {
    console.log('Webtorrent client error', error)
  })

  const publishQueue = await consume(queues.publishBlock)
  publishQueue.subscribeOnNext(async (buffer: Buffer) => {
    try {
      await seedBlockFromBuffer(client, buffer)
    } catch (error) {
      console.log('Unable to seed block', error)
    }
  })

  const startDownloadHash = makeClientDownloadHash.bind(null, client)

  const queue = await consume(queues.downloadHash)
  queue.subscribeOnNext((hash: Buffer) => {
    startDownloadHash(hash).subscribeOnCompleted(async () => {
      try {
        await publish(queues.blockReady, hash)
      } catch(error) {
        console.log('Could not notify of block ready', error)
      }
    })
  })

  await readFileSystem(client)
}

async function seedBlockFromBuffer(client: any, buffer: any) {
  const builder = await getBuilder()
  const block: PoetBlock = builder.serializedToBlock(buffer)
  const id = await getHash(buffer, block.id)
  buffer.name = id

  return new Promise((resolve, reject) => {
    client.seed(buffer, { ...getCreateOpts(block.id), path: makePath(id) }, (torrent: any) => {
      torrent.on('error', reject)
      torrent.on('ready', resolve)
    })
  })
}

async function readFileSystem(client: any) {
  return new Promise((resolve, reject) => {
    fs.readdir('./torrents/', (error, files) => {
      if (error) {
        console.log('Error reading "torrents" folder')
        return reject(error)
      }
      for (let file of files) {
        fs.readdir('./torrents/' + file, (error, subFiles) => {
          if (error) {
            console.log('Error reading folder', file)
            return
          }
          if (subFiles.length > 1) {
            return
          }
          const torrentId = file
          const hash = subFiles[0]

          client.seed(
            fs.createReadStream(makePath(torrentId + '/' + hash)),
            { path: makePath(torrentId), ...getCreateOpts(hash) },
            noop
          )
        })
      }
      return resolve()
    })
  })
}

function makeClientDownloadHash(client: any, hash: Buffer): Rx.Observable<any> {
  return Rx.Observable.create((observer) => {
    const id = hash.toString('hex')
    const uri = 'magnet:?xt=urn:btih:' + id
    client.add(
      uri,
      { path: makePath(id) },
      (torrent: any) => {
        torrent.on('error', (error: any) => {
          observer.onError(error)
        })
        torrent.on('download', () => {
          observer.onNext(torrent.progress)
        })
        torrent.on('done', () => {
          console.log(uri, 'downloaded')
          observer.onCompleted()
        })
      }
    )
  }).publish().refCount()
}

if (!module.parent) {
  startTorrents().catch(error => console.log(error))
}
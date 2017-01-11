import * as fs from 'fs'
import * as WebTorrent from 'webtorrent'
import EventEmitter = NodeJS.EventEmitter

import { consume, publish } from '../helpers/pubsub'
import * as queues from '../queues'
import { noop, assert } from '../common'
import { getCreateOpts, getHash } from '../helpers/torrentHash'
import { PoetBlock } from '../model/claim'
import { default as getBuilder } from '../model/builder'

function makePath(id: string) {
  assert(id.length === 160 / 4, 'Id is of invalid length' + id)
  return './torrents/' + id
}

export default async function startTorrents() {

  const client = new WebTorrent()

  const startDownloadHash = makeClientDownloadHash.bind(null, client)

  const publishQueue = await consume(queues.publishBlock)
  publishQueue.subscribeOnNext(async (buffer: Buffer) => {
    try {
      await seedBlockFromBuffer(client, buffer)
    } catch (error) {
      console.log('Unable to seed block', error)
    }
  })

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
        client.seed(
          makePath(file),
          {
            path: makePath(file),
            ...getCreateOpts(file)
          },
          noop
        )
      }
      return resolve()
    })
  })
}

function makeClientDownloadHash(client: any, hash: Buffer): Rx.Observable<any> {
  return Rx.Observable.create((observer) => {
    const id = hash.toString()
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
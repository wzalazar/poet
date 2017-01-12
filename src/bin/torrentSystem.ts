import * as fs from 'fs'
import * as WebTorrent from 'webtorrent'

import { PoetBlock } from '../model/claim'
import { default as getBuilder } from '../model/builder'
import * as queues from '../queues'
import { consume, publish } from '../helpers/pubsub'
import { getCreateOpts, getHash, createObservableDownload } from '../helpers/torrentHash'
import { noop, readdir, assert } from '../common'

class TorrentSystem {

  private client: any // TODO: upstream webtorrent needs a better definition file
  private path: string

  private static BITS_PER_HEX_BYTE: 4
  private static SHA256_LENGTH_BITS: 256
  private static SHA1_LENGTH_IN_BITS: 160

  constructor(torrentPath: string) {
    this.path = torrentPath
    this.client = new WebTorrent()
    this.client.on('error', (error: any) => {
      this.handleError('Generic WebTorrentError', error)
    })
  }

  async start() {
    await this.listenToQueue()
    await this.scanLocal()
  }

  async listenToQueue() {
    await this.listenToHashesToDownload()
    await this.listenToNewBlocksToSeed()
  }

  async listenToHashesToDownload() {
    let queue
    try {
      queue = await consume(queues.downloadHash)
    } catch (error) {
      this.handleError('Unable to listen to queue', queue)
    }
    queue.subscribeOnNext((hash: Buffer) => {
      const download = createObservableDownload(
        this.client,
        id => this.getPathInStorageFolder(id),
        hash
      )

      download.subscribeOnCompleted(async () => {
        try {
          await publish(queues.blockReady, hash)
        } catch(error) {
          this.handleError('Could not notify of block ready', error)
        }
      })
    })
  }

  async listenToNewBlocksToSeed() {
    let publishQueue
    try {
      publishQueue = await consume(queues.publishBlock)
    } catch (error) {
      this.handleError('Error while consuming queue', error)
    }
    publishQueue.subscribeOnNext(this.seedBlockFromBuffer.bind(this))
  }

  async seedBlockFromBuffer(buffer: Buffer) {
    try {
      const builder = await getBuilder()
      const block: PoetBlock = builder.serializedToBlock(buffer)
      const torrentId = await getHash(buffer, block.id)

      // Copy the buffer to seed and set a custon "name" field needed by WebTorrent
      let seedBuffer = new Buffer(buffer) as any
      seedBuffer.name = torrentId

      return new Promise((resolve, reject) => {
        this.client.seed(
          seedBuffer,
          {
            path: this.getPathInStorageFolder(torrentId),
            ...getCreateOpts(block.id),
          },
          (torrent: any) => {
            torrent.on('error', reject)
            torrent.on('ready', resolve)
          }
        )
      })
    } catch (error) {
      this.handleError('Could not seed file', error)
    }
  }

  async scanLocal() {
    try {
      const folders = await readdir(this.path)
      for (let folder of folders) {
        const files = await readdir(folder)
        if (!TorrentSystem.validDirectoryContents(files)) {
          return
        }
        // The torrent is stored under a folder named with the infoHash of it
        const torrentId = folder
        // And it has only one file, named with the sha256 hash of the block
        const blockHash = files[0]

        this.client.seed(
          this.getFileForSeeding(torrentId, blockHash),
          this.makeSeedOptions(torrentId, blockHash),
          noop
        )
      }
    } catch (error) {
      this.handleError('Could not read stored files', error)
    }
  }

  private getFileForSeeding(torrentId: string, blockHash: string) {
    assert(TorrentSystem.isValidInfoHash(torrentId), 'invalid length for torrent id')
    assert(TorrentSystem.isValidSHA256(blockHash), 'invalid sha256 value')
    return fs.createReadStream(this.getPathInStorageFolder(torrentId + '/' + blockHash))
  }

  private getPathInStorageFolder(file: string) {
    return './torrents/' + file
  }

  /**
   * WebTorrent asks for a path where to download the file, and also options to
   * pass on for the 'create-torrent' library
   */
  private makeSeedOptions(torrentId: string, blockHash: string) {
    return {
      // Path to store the file
      path: this.getPathInStorageFolder(torrentId),
      // create-torrent options
      ...getCreateOpts(blockHash)
    }
  }

  /**
   * The current version of our torrent files has only one file per torrent.
   * This method is used to validate that constraint.
   */
  private static validDirectoryContents(contentFiles: string[]) {
    return contentFiles.length === 1
  }

  private static isValidSHA256(hash: string) {
    return hash.length === TorrentSystem.SHA256_LENGTH_BITS / TorrentSystem.BITS_PER_HEX_BYTE
  }

  private static isValidInfoHash(hash: string) {
    return hash.length === TorrentSystem.SHA1_LENGTH_IN_BITS / TorrentSystem.BITS_PER_HEX_BYTE
  }

  private handleError(message: string, error: any) {
    console.log(message, error, error.stack)
  }
}

export default async function startTorrents() {
  return new TorrentSystem('./torrents').start()
}

if (!module.parent) {
  startTorrents().catch(() => null)
}
import * as WebTorrent from 'webtorrent'
import * as Redis from 'ioredis'

import * as Promise from 'bluebird'

import { PoetBlock } from '../model'

const redis = Promise.promisifyAll(new Redis())
const redisGet = redis['getAsync']
const redisSet = redis['setAsync']

export default class TorrentSystem {
    private client

    constructor() {
        this.client = new WebTorrent()
    }

    fakeDownload(hash: string) {
        return redisGet(hash).then(JSON.parse)
    }

    fakeUpload(hash: string, obj) {
        return redisSet(hash, JSON.stringify(obj))
    }

    download(hash: string) {
        const data = this.client.add('magnet:?xt=urn:btih:' + hash)

        data.on('torrent', metadata => {
            metadata.on('download', () => {
            })
        })
    }

    seed(hash: string, obj) {

    }
}
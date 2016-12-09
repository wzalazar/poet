import { PoetBlock } from '../model/claim'
import * as IORedis from 'ioredis'

import { default as Builders } from '../model/loaders'

var poetBlock;

export default class DownloadSystem {
  listeners
  redis: IORedis.Redis

  constructor() {
    this.listeners = []
    this.redis = new IORedis()

    Builders.then(built => {
      poetBlock = built.poetBlock
    })
  }

  postBlock(block: PoetBlock) {
    this.redis.set(block.id.toString('hex'),
      poetBlock.encode(block).finish()
    )
  }

  downloadBlock(hash: string) {
  }

  subscribe(listener) {
    this.listeners.push(listener)
  }
}
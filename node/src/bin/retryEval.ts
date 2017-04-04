import { default as BlockchainService } from '../blockchain/domainService'
import { Queue } from '../queue'
import { Block } from '../claim'
import { BitcoinBlockMetadata, BlockMetadata } from '../events'

import getBuilder from '../serialization/builder'
import getConnection from '../blockchain/connection'

async function startListening() {
  const blockchain = new BlockchainService()
  const queue = new Queue()

  await blockchain.start(() => getConnection('retryTxs'), getBuilder)

  const setupWorker = (name: string, action: any) => {
    process.nextTick(() => {
      queue.workThread(name, action).catch(error => {
        console.log(error, error.stack)
      })
    })
  }

  setupWorker('blockRetry', async (block: Block) => {
    return await blockchain.blockSeen(block)
  })
  setupWorker('confirmRetry', async (block: BlockMetadata) => {
    return await blockchain.blockConfirmed(block)
  })
}

if (!module.parent) {
  startListening().catch(error => {
    console.log(error, error.stack)
  })
}
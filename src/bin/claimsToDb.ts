import { default as BlockchainService } from '../systems/blockchain/service'
import { Queue } from '../queue'
import { PoetBlock } from '../model/claim'

async function startListening() {
  const blockchain = new BlockchainService()
  const queue = new Queue()

  await blockchain.start()

  try {
    queue.blockDownloaded().subscribeOnNext((block: PoetBlock) => {
      blockchain.storeBlock(block)
    })
  } catch (error) {
    console.log(error, error.stack)
  }
}
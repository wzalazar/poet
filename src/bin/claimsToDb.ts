import { default as BlockchainService } from '../systems/blockchain/service'
import { Queue } from '../queue'
import { Block } from '../model/claim'

async function startListening() {
  const blockchain = new BlockchainService()
  const queue = new Queue()

  await blockchain.start()

  try {
    queue.blockDownloaded().subscribeOnNext((block: Block) => {
      blockchain.storeBlock(block)
    })
  } catch (error) {
    console.log(error, error.stack)
  }
}
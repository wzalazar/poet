import { default as BlockchainService } from '../systems/blockchain/service'
import { Queue } from '../queue'
import { Block } from '../model/claim'
import { PoetBlockInfo } from '../events'

async function startListening() {
  const blockchain = new BlockchainService()
  const queue = new Queue()

  await blockchain.start()

  try {
    queue.blockDownloaded().subscribeOnNext(async (block: Block) => {
      try {
        await blockchain.storeBlock(block)
      } catch (error) {
        console.log(error, error.stack)
      }
    })
    queue.blocksToSend().subscribeOnNext(async (block: Block) => {
      try {
        await blockchain.storeBlock(block)
      } catch (error) {
        console.log(error, error.stack)
      }
    })
    queue.bitcoinBlock().subscribeOnNext(async (block: PoetBlockInfo) => {
      try {
        await blockchain.confirmBlock(block)
      } catch (error) {
        console.log(error, error.stack)
      }
    })
  } catch (error) {
    console.log(error, error.stack)
  }
}

if (!module.parent) {
  startListening().catch(error => {
    console.log(error, error.stack)
  })
}
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
      console.log('Storing block', JSON.stringify(block, null, 2))
      try {
        await blockchain.storeBlock(block)
      } catch (error) {
        console.log(error, error.stack)
      }
    })
    queue.blocksToSend().subscribeOnNext(async (block: Block) => {
      console.log('Storing block', JSON.stringify(block, null, 2))
      try {
        await blockchain.storeBlock(block)
      } catch (error) {
        console.log(error, error.stack)
      }
    })
    queue.bitcoinBlock().subscribeOnNext(async (block: PoetBlockInfo) => {
      console.log('Confirming block', JSON.stringify(block, null, 2))
      try {
        for (let poetTx of block.poet) {
          poetTx.blockHash = block.blockHash
          poetTx.blockHeight = block.blockHeight
          poetTx.timestamp = block.timestamp
          await blockchain.confirmBlock(poetTx)
        }
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
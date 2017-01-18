import { default as BlockchainService } from '../systems/blockchain/service'
import { Queue } from '../queue'
import { Block } from '../model/claim'
import { BitcoinBlockMetadata } from '../events'

import getBuilder from '../model/builder'
import getConnection from '../systems/blockchain/connection'

async function startListening() {
  const blockchain = new BlockchainService()
  const queue = new Queue()

  try {
    await blockchain.start(getConnection, getBuilder)

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

    queue.bitcoinBlock().subscribeOnNext(async (block: BitcoinBlockMetadata) => {
      console.log('Confirming block', JSON.stringify(block, null, 2))
      try {
        for (let poetTx of block.poet) {
          poetTx.bitcoinHash = block.blockHash
          poetTx.bitcoinHeight = block.blockHeight
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
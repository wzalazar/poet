import { default as BlockchainService } from '../blockchain/domainService'
import { Queue } from '../queue'
import { Block } from '../claim'
import { BitcoinBlockMetadata } from '../events'

import getBuilder from '../serialization/builder'
import getConnection from '../blockchain/connection'

async function startListening() {
  const blockchain = new BlockchainService()
  const queue = new Queue()

  try {
    await blockchain.start(() => getConnection('claimsToDb'), getBuilder)

    queue.blockDownloaded().subscribeOnNext(async (block: Block) => {
      console.log('Storing block', block.id)
      try {
        await blockchain.blockSeen(block)
      } catch (error) {
        console.log(error, error.stack)
      }
    })

    queue.blocksToSend().subscribeOnNext(async (block: Block) => {
      console.log('Storing block', block.id)
      try {
        await blockchain.blockSeen(block)
      } catch (error) {
        console.log(error, error.stack)
      }
    })

    queue.bitcoinBlock().subscribeOnNext(async (block: BitcoinBlockMetadata) => {
      try {
        for (let poetTx of block.poet) {
          poetTx.bitcoinHash = block.blockHash
          poetTx.bitcoinHeight = block.blockHeight
          poetTx.timestamp = block.timestamp
          const blockInfo = (await blockchain.getBlockInfoByTorrentHash(poetTx.torrentHash))
          if (blockInfo && blockInfo.timestamp) {
            continue
          }
          console.log('Confirming block with torrent hash', poetTx.torrentHash)
          await blockchain.blockConfirmed(poetTx)
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
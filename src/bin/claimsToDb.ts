import { default as BlockchainService } from '../systems/blockchain/service'
import { consume } from '../helpers/pubsub'
import * as queues from '../queues'
import BlockInfo from '../systems/blockchain/models/blockInfo'

async function startListening() {
  const blockchain = new BlockchainService()

  await blockchain.start()

  try {
    consume(queues.bitcoinBlock).subscribeOnNext((block: BlockInfo) => {
      blockchain.storeBlockdata(block)
    })
  } catch (error) {
    console.log(error, error.stack)
  }
}
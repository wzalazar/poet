import { Queue } from '../src/queue'
import { BitcoinBlockMetadata } from '../src/events'

export default async function create() {
  const queue = new Queue()

  const bitcoinBlock: BitcoinBlockMetadata = {
    blockHeight: 1000,
    blockHash: 'bitcoin block hash',
    timestamp: 3543,
    poet: [{
      torrentHash: process.argv[2],
      transactionHash: 'transaction hash',
      outputIndex: 0,
      transactionOrder: 2
    }]
  }

  await queue.announceBitcoinBlock(bitcoinBlock)
}

if (!module.parent) {
  create().catch(error => {
    console.log(error, error.stack)
  })
}

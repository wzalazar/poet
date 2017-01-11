import { consume, publish } from '../helpers/pubsub'
import * as queues from '../queues'
import { BitcoinBlockInfo, PoetTxInfo } from "../events/blockInfo"

export default async function downloadBlocks() {

  let tx, block

  try {
    tx = await consume(queues.poetHash)
  } catch (error) {
    console.log('Could not wait on queue', queues.poetHash, error, error.stack)
  }

  tx.subscribeOnNext(async (msg: any) => {
    try {
      const poetTx: PoetTxInfo = JSON.parse(msg.toString())
      console.log('Transaction received, should download', poetTx.torrentHash)
      await publish(queues.downloadHash, new Buffer(poetTx.torrentHash, 'hex'))
    } catch (error) {
      console.log('Error listening', error, error.stack)
    }
  })

  try {
    block = await consume(queues.bitcoinBlock)
  } catch (error) {
    console.log('Could not wait on queue', queues.bitcoinBlock, error, error.stack)
  }
  block.subscribeOnNext(async (msg) => {
    try {
      const block: BitcoinBlockInfo = JSON.parse(msg.toString())
      await block.poet.map(async (poet) => {
        return await publish(queues.downloadHash, new Buffer(poet.torrentHash, 'hex'))
      })
      console.log(
        'Block received, should download', block.poet.length, 'things:',
        block.poet.map(poet => poet.torrentHash).join(', ')
      )
    } catch (error) {
      console.log('Error listening', error, error.stack)
    }
  })

  return { tx, block }
}

if (!module.parent) {
  downloadBlocks().catch(error => console.log(error))
}
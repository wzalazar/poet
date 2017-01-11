import { consume, publish } from '../helpers/pubsub'
import * as queues from '../queues'
import { BitcoinBlockInfo, PoetTxInfo } from "../events/blockInfo"

export default async function downloadBlocks() {

  const tx = await consume(queues.poetHash)
  tx.subscribeOnNext(async (msg) => {
    try {
      const poetTx: PoetTxInfo = JSON.parse(msg.toString())
      console.log('Transaction received, should download', poetTx.poetHash)
      await publish(queues.downloadHash, new Buffer(poetTx.poetHash, 'hex'))
    } catch (error) {
      console.log('Error listening', error, error.stack)
    }
  })

  const block = await consume(queues.bitcoinBlock)
  block.subscribeOnNext(async (msg) => {
    try {
      const block: BitcoinBlockInfo = JSON.parse(msg.toString())
      await block.poet.map(async (poet) => {
        return await publish(queues.downloadHash, new Buffer(poet.poetHash, 'hex'))
      })
      console.log(
        'Block received, should download', block.poet.length, 'things:',
        block.poet.map(poet => poet.poetHash).join(', ')
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
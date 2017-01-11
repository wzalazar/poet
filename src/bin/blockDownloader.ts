import { consume } from '../helpers/pubsub'
import * as queues from '../queues'
import { BitcoinBlockInfo, PoetTxInfo } from "../events/blockInfo"

export default async function downloadBlocks() {

  const tx = await consume(queues.poetHash)
  tx.subscribeOnNext(msg => {
    try {
      const poetTx: PoetTxInfo = JSON.parse(msg.toString())
      console.log('Should download hash', poetTx.poetHash)
    } catch (error) {
      console.log('Error listening', error, error.stack)
    }
  })

  const block = await consume(queues.bitcoinBlock)
  block.subscribeOnNext(msg => {
    try {
      const block: BitcoinBlockInfo = JSON.parse(msg.toString())
      console.log(
        'Block received, should download', block.poet.length, 'things: ',
        block.poet.map(poet => poet.poetHash).join(', ')
      )
    } catch (error) {
      console.log('Error listening', error, error.stack)
    }
  })

  return { tx, block }
}

if (!module.parent) {
  downloadBlocks()
}
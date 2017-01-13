import { consume, publish } from '../helpers/pubsub'
import * as queues from '../queues'
import { PoetBlockInfo, PoetTxInfo } from "../blockInfo"

/**
 * This system is in charge of notifying other components of hashes that have
 * been advertised on the bitcoin blockchain and should be downloaded.
 *
 * Hashes fired by this system are not warranted to be unique.
 */
export class BitcoinHashNotifier {

  static OUT_QUEUE = queues.downloadHash

  static TXINFO_TO_BUFFER_HASH = (poetTx: PoetTxInfo) => new Buffer(poetTx.torrentHash, 'hex')

  async listenAll() {
    return {
      blocks: await this.listenForBlocks(),
      txs: await this.listenForTxs()
    }
  }

  listenForTxs() {
    const queueName = queues.poetHash
    const transform = (msg: Buffer) => [
      BitcoinHashNotifier.TXINFO_TO_BUFFER_HASH(JSON.parse(msg.toString()))
    ]
    return this.listen(queueName, transform)
  }

  listenForBlocks() {
    const queueName = queues.bitcoinBlock
    const transform = (msg: Buffer) => {
      const block: PoetBlockInfo = JSON.parse(msg.toString())
      return block.poet.map(BitcoinHashNotifier.TXINFO_TO_BUFFER_HASH)
    }
    return this.listen(queueName, transform)
  }

  async listen(queueName: string, iterator: (_: Buffer) => any) {
    let topic
    try {
      topic = await consume(queueName)
    } catch (error) {
      this.handleError('Could not wait on queue', error)
      return
    }

    topic.subscribeOnNext(async (payload: any) => {
      try {
        for (let message of iterator(payload)) {
          await publish(BitcoinHashNotifier.OUT_QUEUE, message)
        }
      } catch (error) {
        this.handleError('Error listening', error)
      }
    })

    return topic
  }

  handleError(message: string, error: any) {
    return console.log(message, error, error.stack)
  }
}

export default async function downloadBlocks() {
  const notifier = new BitcoinHashNotifier()
  await notifier.listenAll()
}

if (!module.parent) {
  downloadBlocks().catch(error => console.log(error))
}
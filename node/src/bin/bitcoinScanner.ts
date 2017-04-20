import Bluebird = require("bluebird")

import PoetInsightListener from '../insight'
import { Queue } from '../queue'


async function startup() {
  let insight: PoetInsightListener

  const queue = new Queue()

  console.log('Requesting blockchain info from insight...')

  async function scanBlock(height: number) {
    let block: any
    try {
      block = await insight.fetchBitcoreBlockByHeight(height)
      insight.scanBitcoreBlock(block, height)
    } catch (e) {
      console.log(`Error trying to fetch block height ${height}`)
    }
  }

  try {
    insight = new PoetInsightListener('https://test-insight.bitpay.com')

    insight.subscribeBitcoinBlock(async (block) => {
      // Store ntxid => txid info
      for (let tx of block.transactions) {
        await queue.announceNormalizedTransaction({
          ntxId: tx.nid,
          txId: tx.id
        })
      }
    })

    queue.bitcoinBlockProcessed().subscribeOnNext(async (latest: number) => {
      console.log('Scanning block', latest + 1)
      scanBlock(latest + 1)
    })

    insight.subscribeBlock(async (block) => {
      console.log('found block info', block)
      try {
        await queue.announceBitcoinBlock(block)
      } catch (error) {
        console.log('Could not publish block', error, error.stack)
      }
    })

    insight.subscribeTx(async (tx) => {
      console.log('found tx', tx)
      try {
        await queue.announceBitcoinTransaction(tx)
      } catch (error) {
        console.log('Could not publish tx', error, error.stack)
      }
    })
  } catch (error) {
    console.log('Could not initialize insight', error, error.stack)
    throw error
  }
  console.log('Setup complete!')
}

startup().catch(error => {
  console.log(error, error.stack)
  process.exit(1)
})

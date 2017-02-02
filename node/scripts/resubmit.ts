import { Queue } from '../src/queue'
import { BitcoinBlockMetadata } from '../src/events'
import { default as Insight } from '../src/insight'

export async function publish(id: string) {
  const queue = new Queue()

  const insight = new Insight('https://test-insight.bitpay.com')
  const bitcoinBlock = await insight.manageNewBlock(id)

  await queue.announceBitcoinBlock(bitcoinBlock)

}

export default async function create() {
  return await publish(process.argv[2])
}

if (!module.parent) {
  create().catch(error => {
    console.log(error, error.stack)
  })
}

import * as bluebird from 'bluebird'
import * as amqp from 'amqplib/callback_api'
import * as Rx from 'rx'
import { Channel } from "amqplib"

import { BitcoinBlockMetadata, BlockMetadata } from './events'
import { Block } from './claim'
import { delay } from './common'

const BITCOIN_BLOCK = 'bitcoinBlock'
const BITCOIN_TRANSACTION = 'bitcoinTransaction'
const BLOCK_READY = 'blockReady'
const SEND_BLOCK = 'sendBlock'

const amqpConnect = bluebird.promisify(amqp.connect, amqp) as any

export async function connect() {
  let attempts = 30
  while (attempts--) {
    try {
      return (await amqpConnect('amqp://rabbit:rabbit@rabbitmq:5672')) as amqp.Connection
    } catch (error) {
      console.log('Reconnecting...')
      await delay(1000)
    }
  }
  console.log('Never connected!!')
  throw new Error('Unable to find rabbit')
}

export class Queue {
  bitcoinBlock(): Rx.Observable<BitcoinBlockMetadata> {
    return this.consume(BITCOIN_BLOCK) as Rx.Observable<BitcoinBlockMetadata>
  }

  transactionHeard(): Rx.Observable<BlockMetadata> {
    return this.consume(BITCOIN_TRANSACTION) as Rx.Observable<BlockMetadata>
  }

  blocksToSend(): Rx.Observable<Block> {
    return this.consume(SEND_BLOCK) as Rx.Observable<Block>
  }

  blockDownloaded(): Rx.Observable<Block> {
    return this.consume(BLOCK_READY) as Rx.Observable<Block>
  }

  announceBitcoinBlock(bitcoinBlock: BitcoinBlockMetadata) {
    return this.publish(BITCOIN_BLOCK, bitcoinBlock)
  }

  announceBlockReady(block: Block) {
    return this.publish(BLOCK_READY, block)
  }

  announceBlockToSend(block: Block) {
    return this.publish(SEND_BLOCK, block)
  }

  announceBitcoinTransaction(poetTx: BlockMetadata) {
    return this.publish(BITCOIN_TRANSACTION, poetTx)
  }

  private consume(target: string) {
    return Rx.Observable.create(async (observer: any) => {
      let connection, channel: Channel

      try {
        connection = await connect()
        channel = await bluebird.promisify(connection.createChannel.bind(connection))() as Channel
      } catch (error) {
        observer.onError(error)
        return
      }

      try {
        const queue = await channel.assertQueue('', { exclusive: true })
        await channel.assertExchange(target, 'fanout')
        await channel.bindQueue(queue.queue, target, '')
        await channel.consume(queue.queue, (msg) => {
          observer.onNext(JSON.parse(msg.content.toString()))
        }, { noAck: true  })
      } catch (error) {
        observer.onError(error)
        return
      }
      return bluebird.resolve()
    }).publish().refCount()
  }

  private async publish(target: string, payload: any) {
    let connection, channel
    try {
      connection = (await connect()) as amqp.Connection
      channel = await bluebird.promisify(connection.createChannel.bind(connection))() as Channel
      await channel.assertExchange(target, 'fanout', { durable: true })
      await channel.publish(target, '', new Buffer(JSON.stringify(payload)))
      return await channel.close()
    } catch (error) {
      console.log('Error publishing', error, error.stack)
      throw error
    }
  }

  private async dispatchWork(target: string, payload: any) {
    let connection, channel
    try {
      connection = (await connect()) as amqp.Connection
      channel = await bluebird.promisify(connection.createChannel.bind(connection))() as Channel

      await channel.assertQueue(target, { durable: true })
      await channel.sendToQueue(target, new Buffer(JSON.stringify(payload)), { persistent: true })
      return await channel.close()
    } catch (error) {
      console.log('Error publishing', error, error.stack)
      throw error
    }
  }

  private async workThread(queueName: string, handler: any) {
    let connection, channel: Channel

    try {
      connection = await connect()
    } catch (error) {
      console.log('Error connecting', error)
      return
    }

    const queue = await channel.assertQueue(queueName, { durable: true })
    channel.prefetch(1)

    await channel.consume(queueName, (msg) => {
      const payload = JSON.parse(msg.content.toString())
      try {
        handler(payload)
        channel.ack(msg)
      } catch (error) {
        channel.nack(msg)
      }
    })
  }
}

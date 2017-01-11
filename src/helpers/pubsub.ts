import * as bluebird from 'bluebird'
import * as amqp from 'amqplib/callback_api'
import * as Rx from 'rx'
import { Channel } from "amqplib"

const amqpConnect = bluebird.promisify(amqp.connect, amqp)
const exchangeType = 'fanout'
const exchangeOpts = { durable: false }

export async function consume(target: string) {
  return Rx.Observable.create(async (observer) => {
    let connection, channel
    try {
      connection = await amqpConnect() as amqp.Connection
      channel = await bluebird.promisify(connection.createChannel.bind(connection))() as Channel
    } catch (error) {
      observer.onError(error)
      return
    }

    try {
      const assert = bluebird.promisify(channel.assertQueue.bind(channel)) as any
      const queue = await assert('', { exclusive: true }) as any
      channel.bindQueue(queue.queue, target, '')
      channel.consume(queue.queue, function(msg) {
        observer.onNext(msg.content)
      }, { noAck: true  })
    } catch (error) {
      observer.onError(error)
      return
    }
    return bluebird.resolve()
  }).publish().refCount()
}

export async function publish(target: string, payload: Buffer) {
  let connection, channel
  connection = await amqpConnect() as amqp.Connection
  channel = await bluebird.promisify(connection.createChannel.bind(connection))() as Channel
  await channel.assertExchange(target, exchangeType, exchangeOpts)
  await channel.publish(target, '', payload)
  return await channel.close()
}

import * as bluebird from 'bluebird'
import * as amqp from 'amqplib/callback_api'
import * as Rx from 'rx'
import { Channel } from "amqplib"

const amqpConnect = bluebird.promisify(amqp.connect, amqp)

export async function consume(target: string) {
  return Rx.Observable.create(async (observer: any) => {
    let connection, channel: Channel

    try {
      connection = await amqpConnect() as amqp.Connection
      channel = await bluebird.promisify(connection.createChannel.bind(connection))() as Channel
    } catch (error) {
      observer.onError(error)
      return
    }

    try {
      const queue = await channel.assertQueue('', { exclusive: true })
      await channel.assertExchange(target, 'fanout')
      await channel.bindQueue(queue.queue, target, '')
      await channel.consume(queue.queue, function(msg) {
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
  await channel.sendToQueue(target, payload)
  return await channel.close()
}

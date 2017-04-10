import * as bluebird from 'bluebird'
import * as amqp from 'amqplib/callback_api'
import * as Rx from 'rx'
import { Channel } from "amqplib"
import "reflect-metadata"

const amqpConnect = bluebird.promisify(amqp.connect, amqp) as any

async function delay(millis: number) {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, millis)
    })
}

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

export class Notification {

    requestId: string   // request_id to to-be-signed payload
    pubKey: string      // signer's public key
}

export class Queue {

    pollNotifications(): Rx.Observable<Notification> {
        return this.consume("notifications") as Rx.Observable<Notification>
    }

    publishNotification(notification: Notification) {
        return this.publish("notifications", notification)
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
}

const queue = new Queue()
for (let i in [1,2,3,4,5,6]) {
    let notification = new Notification()
    notification.requestId = "sdsdsd"
    notification.pubKey = "0440121ce9ea2ed8cbab98f652daaabb35fa550dff5a2b1b4f53cf3e81093b86c34899294c2fd7bc0026ed9e6f16336e9e79f984c1373a4cfd26ba96251f0fa125"
    queue.publishNotification(notification)
}

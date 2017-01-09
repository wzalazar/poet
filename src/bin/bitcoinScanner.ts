import * as amqp from 'amqplib/callback_api'
import * as bluebird from 'bluebird'

import * as queues from '../queues'
import PoetInsightListener from "../systems/insight"
import Bluebird = require("bluebird")

const amqpConnect = bluebird.promisify(amqp.connect, amqp)

async function startup() {
  let connection, channel, insight

  console.log('Connecting to rabbitmq...')
  try {
    connection = await amqpConnect() as amqp.Connection
    channel = bluebird.promisify(connection.createChannel)
  } catch (error) {
    console.log('Could not connect to RabbitMQ')
    throw (error)
  }

  console.log('Requesting blockchain info from insight...')
  try {
    insight = new PoetInsightListener('https://test-insight.bitpay.com')

    insight.subscribeBlock((block) => {
      channel.assertExchange(queues.bitcoinBlock, 'fanout', { durable: false })
      channel.publish(queues.bitcoinBlock, '', new Buffer(JSON.stringify(block)))
    })

    insight.subscribeTx((tx) => {
      channel.assertExchange(queues.poetHash, 'fanout', { durable: false })
      channel.publish(queues.poetHash, '', new Buffer(JSON.stringify(tx)))
    })
  } catch (error) {
    console.log('Could not initialize insight')
    throw error
  }
  console.log('Setup complete!')
}

startup().catch(error => {
  console.log(error, error.stack)
  process.exit(1)
})

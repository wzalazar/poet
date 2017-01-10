import * as amqp from 'amqplib/callback_api'
import * as bluebird from 'bluebird'

import * as queues from '../queues'
import PoetInsightListener from "../systems/insight"
import Bluebird = require("bluebird")
import { Channel } from "amqplib"

const amqpConnect = bluebird.promisify(amqp.connect, amqp)
const exchangeType = 'fanout'
const exchangeOpts = { durable: false }

async function startup() {
  let connection, channel: amqp.Channel, insight

  console.log('Connecting to rabbitmq...')
  try {
    connection = await amqpConnect() as amqp.Connection
    channel = await bluebird.promisify(connection.createChannel.bind(connection))() as Channel
  } catch (error) {
    console.log('Could not connect to RabbitMQ')
    throw (error)
  }

  console.log('Requesting blockchain info from insight...')
  try {
    insight = new PoetInsightListener('https://test-insight.bitpay.com')

    insight.subscribeBlock((block) => {
      console.log('found block', block)
      channel.assertExchange(queues.bitcoinBlock, exchangeType, exchangeOpts)
      channel.publish(queues.bitcoinBlock, '', new Buffer(JSON.stringify(block)))
    })

    insight.subscribeTx((tx) => {
      console.log('found tx', tx)
      channel.assertExchange(queues.poetHash, exchangeType, { durable: false })
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

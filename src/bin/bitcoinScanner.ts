import * as amqp from 'amqplib/callback_api'
import * as bluebird from 'bluebird'

import * as queues from '../queues'
import PoetInsightListener from "../systems/insight"
import Bluebird = require("bluebird")
import { Channel } from "amqplib"
import { publish } from "../helpers/pubsub"


async function startup() {
  let connection, channel: amqp.Channel, insight

  console.log('Requesting blockchain info from insight...')
  try {
    insight = new PoetInsightListener('https://test-insight.bitpay.com')

    insight.subscribeBlock(async (block) => {
      console.log('found block', block)
    })

    insight.subscribeTx(async (tx) => {
      console.log('found tx', tx)
      try {
        await publish(queues.poetHash, new Buffer(JSON.stringify(tx)))
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

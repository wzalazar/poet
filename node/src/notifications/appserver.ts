const express  = require('express')
const bodyParser = require('body-parser')
const logger = require('morgan')
//var io = require('socket.io')
const fcm = require('fcm-node')

import "reflect-metadata"
import * as path from 'path'
import { createConnection, Connection } from 'typeorm'
import Device from './device'
import { Queue, Notification } from './queue'

const SERVER_API_KEY='YOUR_SERVER_API_KEY'
const registrationToken = 'FIREBASE_EXAMPLE_REGISTRATION_TOKEN'

function createServer (serverKey: string, port: number) {
  const fcmCli = new fcm(serverKey)

  const app = express()

  app.use(express.static(__dirname + '/public'))
  app.use(bodyParser.json())
  app.use(logger('dev'))

  const listen = app.listen(port)
  console.log('The App runs on port ' + port)

  var payloadOK = {
    to: registrationToken,
    data: { //some data object (optional)
      url: 'news',
      foo:'fooooooooooooo',
      bar:'bar bar bar'
    },
    priority: 'high',
    content_available: true,
    notification: { //notification object
      title: 'HELLO', body: 'World!', sound : "default", badge: "1"
    }
  }

  const callbackLog = function (sender: string, err: any, res: any) {
    console.log("\n__________________________________")
    console.log("\t" + sender)
    console.log("----------------------------------")
    console.log("err=" + err)
    console.log("res=" + res)
    console.log("----------------------------------\n>>>")
  }

  app.post('/register', async function(req: any, res: any) {

    const deviceName = req.body.deviceName
    const deviceId   = req.body.deviceId
    const registrationId = req.body.registrationId
    const platform = req.body.platform
    const pubKey = req.body.pubKey

    if (typeof pubKey  == 'undefined' || typeof deviceId == 'undefined' || typeof registrationId  == 'undefined') {
        //TODO error handling
        // console.log(constants.error.msg_invalid_param.message)
        // res.json(constants.error.msg_invalid_param)
    } else if (!pubKey.trim() || !deviceId.trim() || !registrationId.trim()) {
        //TODO error handling
        // console.log(constants.error.msg_empty_param.message)
        // res.json(constants.error.msg_empty_param)
    } else {

      try {

        if (connection == undefined) {
          connection = await getConnection()
        }

        let device = new Device()
        device.deviceId = deviceId
        device.deviceName = deviceName
        device.platform = platform
        device.publicKey = pubKey
        device.registrationId = registrationId

        let deviceRepository = connection.getRepository(Device)
        await deviceRepository.persist(device)

        res.end("It works!!")
        console.log("Device has been saved")

      } catch (error) {

        console.log(error)
        res.end("It didn't work :(!!")

      }
    }
  })

  app.post('/send', function(req: any, res: any) {
    
    var message = req.body.message
    var registrationId = req.body.registrationId

    console.log("message=" + message)
    console.log("registrationId=" + registrationId)

    payloadOK.to = registrationId
    payloadOK.notification.body = message

    fcmCli.send(payloadOK, function(err: any, res: any) {
      callbackLog('sendOK', err, res)
      res.end("It works!!")
    })
  })

  function buildNotification(device: Device, title: string, body: string) {
    return {
      to: device.registrationId,
      // data: { //some data object (optional)
      //     url: 'news',
      //     foo:'fooooooooooooo',
      //     bar:'bar bar bar'
      // },
      priority: 'high',
      content_available: true,
      notification: { //notification object
        title: title, body: body, sound : "default", badge: "1"
      }
    }
  }

  // TODO better error handling and retries
  let connection: Connection
  async function getConnection(): Promise<Connection> {
    return createConnection({
      driver: {
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'poet',
        password: 'poet',
        database: 'poet'
      },
      entities: [
        path.join(__dirname, 'device.ts')
      ],
      autoSchemaSync: true
    })
  }

  async function getDevice(pubKey: string, connection?: Connection): Promise<Device> {
    if (connection == undefined) {
      connection = await getConnection()
    }
    const deviceRepository = connection.getRepository(Device)
    return (await deviceRepository.findOne({publicKey : pubKey}))
  }

  async function startListening() {
    const queue = new Queue()
    connection = await getConnection()

    queue.pollNotifications().subscribeOnNext(async (notification: Notification) => {
      console.log('consuming msg', notification)

      const device = await getDevice(notification.pubKey, connection)

      console.log('found registered device: ', device)

      fcmCli.send(buildNotification(
        device,
        "Hi stranger!",
        "Welcome to my house!"),
        function(err: any) {
          callbackLog('sendOK', err, undefined)
        }
      )
    })
  }

  startListening().catch(error => {
    console.log(error, error.stack)
  })
}

export default createServer

if (!module.parent) {
  createServer(SERVER_API_KEY, 5500)
}

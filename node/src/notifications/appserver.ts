const express  = require('express')
const bodyParser = require('body-parser')
const logger = require('morgan')
//var io = require('socket.io')
const fcm = require('fcm-node')

import "reflect-metadata"
import * as path from 'path'
import { createConnection } from 'typeorm'
import Device from './device'

const SERVER_API_KEY='YOUR_SERVER_API_KEY'
const registrationToken = 'FIREBASE_EXAMPLE_REGISTRATION_TOKEN'
const fcmCli = new fcm(SERVER_API_KEY)
const app      = express()
const port     = process.env.PORT || 8080

app.use(express.static(__dirname + '/public'))
app.use(bodyParser.json())
app.use(logger('dev'))

const listen = app.listen(port)
//var socket = io.listen(listen)

//require('./routes/routes')(app,socket)

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

app.post('/register',function(req: any, res: any) {

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

        createConnection({
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
        }).then(async connection => {

            let device = new Device()
            device.deviceId = deviceId
            device.deviceName = deviceName
            device.platform = platform
            device.publicKey = pubKey
            device.registrationId = registrationId

            let deviceRepository = connection.getRepository(Device)
            await deviceRepository.persist(device)

            connection.close()
            res.end("It works!!")
            console.log("Device has been saved")
        }).catch(error => {
            console.log(error)
            res.end("It didn't work :(!!")
        })
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


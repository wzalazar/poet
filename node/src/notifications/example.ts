/**
 * Created by Leonardo on 02/08/2016.
 */

const FCM = require('fcm-node')

const SERVER_API_KEY='YOUR_SERVER_API_KEY'
const validDeviceRegistrationToken = 'c1m7I:A ... bjj4SK-' //put a valid device token here

var fcmCli= new FCM(SERVER_API_KEY)

var payloadOK = {
    to: validDeviceRegistrationToken,
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

var payloadError = {
    to: "4564654654654654", //invalid registration token
    data: {
        url: "news"
    },
    priority: 'high',
    content_available: true,
    notification: { title: 'TEST HELLO', body: '123', sound : "default", badge: "1" }
}

var payloadMulticast = {
    registration_ids:["4564654654654654",
        '123123123',
        validDeviceRegistrationToken, //valid token among invalid tokens to see the error and ok response
        '123133213123123'],
    data: {
        url: "news"
    },
    priority: 'high',
    content_available: true,
    notification: { title: 'Hello', body: 'Multicast', sound : "default", badge: "1" }
}

var callbackLog = function (sender: string, err: any, res: any) {
    console.log("\n__________________________________")
    console.log("\t" + sender)
    console.log("----------------------------------")
    console.log("err=" + err)
    console.log("res=" + res)
    console.log("----------------------------------\n>>>")
}

function sendOK()
{
    fcmCli.send(payloadOK, function(err: any, res: any) {
        callbackLog('sendOK', err, res)
    })
}

function sendError() {
    fcmCli.send(payloadError, function(err: any, res: any) {
        callbackLog('sendError', err, res)
    })
}

function sendMulticast(){
    fcmCli.send(payloadMulticast, function(err: any, res: any) {
        callbackLog('sendMulticast', err, res)
    })
}


sendOK()
sendMulticast()
sendError()

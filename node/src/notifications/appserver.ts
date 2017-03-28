const express  = require('express');
const app      = express();
const port     = process.env.PORT || 8080;

const bodyParser = require('body-parser');
const logger = require('morgan');
//var io = require('socket.io');

const fcm = require('fcm-node');  
const SERVER_API_KEY='YOUR_SERVER_API_KEY';
const registrationToken = 'FIREBASE_EXAMPLE_REGISTRATION_TOKEN';

const fcmCli = new fcm(SERVER_API_KEY);

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(logger('dev'));

const listen = app.listen(port);
//var socket = io.listen(listen);

//require('./routes/routes')(app,socket);


console.log('The App runs on port ' + port);

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
};

const callbackLog = function (sender: string, err: any, res: any) {
    console.log("\n__________________________________")
    console.log("\t" + sender);
    console.log("----------------------------------")
    console.log("err=" + err);
    console.log("res=" + res);
    console.log("----------------------------------\n>>>");
};

app.post('/send', function(req: any, res:any) {
	
	var message = req.body.message;
	var registrationId = req.body.registrationId;

	console.log("message=" + message);
	console.log("registrationId=" + registrationId);

	payloadOK.to = registrationId;
	payloadOK.notification.body = message;

	fcmCli.send(payloadOK, function(err: any, res: any) {
		callbackLog('sendOK',err,res);	
	});

});


var express = require('express');
var request = require('request');
var router = express.Router();

var config = require('../config/config');
var l = require('../utilities/logUtils');
var firebaseUsers = require('../api/controllers/FirebaseUsers');

const fb_page_access_token = config.fb_page_access_token;
const fb_verify_token = config.fb_verify_token;


// On server start subscribe to Facebook Messenger webhook.
subscribeWebhook();


/**
 * Routes
 */

// Setup Messenger webhook.
router.get('/api/v1/webhook/', function (req, res) {
    if (req.query['hub.verify_token'] === fb_verify_token) {
        res.send(req.query['hub.challenge']);
    }

    res.send('Error, wrong Facebook validation token.');
});

//Get messages.
router.post('/api/v1/webhook/', function (req, res) {
    var messaging_events = req.body.entry[0].messaging;

    for (var i = 0; i < messaging_events.length; i++) {
        var event = req.body.entry[0].messaging[i];
        var sender = event.sender.id;

        if (event.message && event.message.text) {
            text = event.message.text;
            sendTextMessage(sender, 'Text received, echo: ' + text.substring(0, 200));
            firebaseUsers.writeUserMessage(sender, text);
        }
    }

    res.sendStatus(200);
});


/**
 * Functions
 */

// Subscribe to the Facebook Messenger webhook.
function subscribeWebhook() {
    request({
        url: 'https://graph.facebook.com/v2.6/me/subscribed_apps?access_token=' + fb_page_access_token,
        method: 'POST'
    }, function (error, response) {
        if (error) {
            l.d('Error sending message: ', error);
        } else if (response.body.error) {
            l.d('Error: ', response.body.error);
        } else {
            l.d('Subscribed to Facebook Webhook.');
        }
    });
}

// Send message to user.
function sendTextMessage(sender, text) {
    var messageData = {
        text: text
    };
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token: fb_page_access_token},
        method: 'POST',
        json: {
            recipient: {id: sender},
            message: messageData
        }
    }, function (error, response) {
        if (error) {
            l.d('Error sending message: ', error);
        } else if (response.body.error) {
            l.d('Error: ', response.body.error);
        }
    });
}

module.exports = router;
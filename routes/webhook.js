/*
 * node_modules
 */
var express = require('express');
var request = require("request");
var router = express.Router();

/*
 * Custom
 */
var config = require('../config/config');
var l = require('../utilities/lib/logUtils');

var fb_token = config.fb_token;


// On server start subscribe webhook.
subscribeWebhook();


/*
 * Routes
 */

/* Setup messenger webhook. */
router.get('/api/v1/webhook/', function (req, res) {
    if (req.query['hub.verify_token'] === 'blue_sky') {
        res.send(req.query['hub.challenge']);
    }
    res.send('Error, wrong validation fb_token');
});

/* Get messages */
router.post('/api/v1/webhook/', function (req, res) {
    messaging_events = req.body.entry[0].messaging;
    for (i = 0; i < messaging_events.length; i++) {
        event = req.body.entry[0].messaging[i];
        sender = event.sender.id;
        if (event.message && event.message.text) {
            text = event.message.text;
            sendTextMessage(sender, "Text received, echo: " + text.substring(0, 200));

        }
    }
    res.sendStatus(200);
});


/*
 * Functions
 */

function subscribeWebhook() {
    request({
        url: 'https://graph.facebook.com/v2.6/me/subscribed_apps?access_token=' + fb_token,
        method: 'POST'
    }, function (error, response) {
        if (error) {
            l.d('Error sending message: ', error);
        } else if (response.body.error) {
            l.d('Error: ', response.body.error);
        } else {
            l.d('Subscribed to Webhook.');
        }
    });
}


function sendTextMessage(sender, text) {
    var messageData = {
        text: text
    };
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token: fb_token},
        method: 'POST',
        json: {
            recipient: {id: sender},
            message: messageData,
        }
    }, function (error, response, body) {
        if (error) {
            l.d('Error sending message: ', error);
        } else if (response.body.error) {
            l.d('Error: ', response.body.error);
        }
    });
}

module.exports = router;
var express = require('express');
var request = require('request');
var router = express.Router();
var messenger = require('../messenger/messenger');


var config = require('../config/config');
var l = require('../utilities/logUtils');
var sendMessage = require('../api/controllers/SendMessages');



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
        var text;
        if (event.message && event.message.text) {
            text = event.message.text;
            messenger.received(sender,text)
        }
        if(event.postback){
            text = event.postback.payload;
            messenger.received(sender,text)
        }
    }
    res.sendStatus(200);
});

router.post('/internalApi/webhook/article',function (req, res) {
    if(req.error){
        l.d("error in internalAPI webhook route");
        res.json({message:"error"});
    }
    var result = req.body;
    var reply;
    res.json({message:"success"});

    if(result.template){
        sendMessage.sendTemplate(result.articles,result.fbId);
        /*for (var i=0; i<result.articles.length; i++){
            reply = result.articles[i].headline+' \n'+result.articles[i].shortURL;
            sendMessage.sendTextMessage(result.fbId,reply);
        }*/
    }
    else{
        sendMessage.sendTemplate([{headline:result.headline,articleURL:result.articleURL,thumbnailURL:result.thumbnailURL,trailText:result.trailText}],result.fbId);
        /*reply = result.headline+' \n'+result.shortURL;
        sendMessage.sendTextMessage(result.fbId, reply);*/
    }
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

module.exports = router;

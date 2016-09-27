var express = require('express');
var request = require('request');
var router = express.Router();
var db = require('../api/controllers/dbRequests');

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

        if (event.message && event.message.text) {
            var text = event.message.text;
            var reply = "";
            l.d('Nachricht empfangen von '+ sender + ': ' +text);
            /*
            * ** Pseudocode **
            * if text in arrayUniversalKeywords
            * else get scenario of user
            *   do something
            * if scenario == welcomestep1
            * send welcomemessage
            * if scneario == ...
            *
            * Scenarios:
            * - Welcome
            * - Settings
            * - Top Stories
            * - Summary
            * - Instant Update
            * - Instant Update Setup
            * - Feedback
            *
            * */
            switch(text) {
                case "news":
                case "News!":
                case "What's new":
                case 'Update':
                case 'update':
                case 'summary':
                case 'Summary':
                    db.getSummary(sender,5,function (result) {
                        result = result.data;
                        console.log(result);
                        for (var i=0; i<result.length; i++){
                            var reply = result[i].headline+' \n'+result[i].shortURL;
                            sendMessage.sendTextMessage(sender,reply);
                        }
                    });
                    //firebaseNews.getLatestNews(sender, "test");
                    break;
                case "start":
                case "Start":
                    reply = 'You are now subscribed to all new articles.';
                    db.saveUserPref(sender, 'breaking', true);
                    sendMessage.sendTextMessage(sender, reply);
                    //firebaseUsers.writeUserMessage(sender, text);
                    break;
                case "stop":
                case "Stop":
                case "STOP":
                case "halt":
                    reply = "Sorry. You won’t get any messages from me until you write ‘start'.";
                    db.saveUserPref(sender, 'breaking', false);
                    sendMessage.sendTextMessage(sender, reply);
                    //firebaseUsers.writeUserMessage(sender, text);
                    break;
                default:
                    reply = 'I do not understand this: ' + text.substring(0, 200);
                    sendMessage.sendTextMessage(sender, reply);
                    //firebaseUsers.writeUserMessage(sender, text);
            }
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
        for (var i=0; i<result.articles.length; i++){
            reply = result.articles[i].headline+' \n'+result.articles[i].shortURL;
            sendMessage.sendTextMessage(result.fbId,reply);
        }
    }
    else{
        reply = result.headline+' \n'+result.shortURL;
        sendMessage.sendTextMessage(result.fbId, reply);
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

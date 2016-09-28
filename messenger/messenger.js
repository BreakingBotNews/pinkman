var l = require('../utilities/logUtils');
var db = require('../api/controllers/dbRequests');
var sendMessage = require('../api/controllers/SendMessages');


module.exports = {
    received: function(sender, text) {
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
                break;
            case "start":
            case "Start":
                reply = 'You are now subscribed to all new articles.';
                db.saveUserPref(sender, 'breaking', true);
                sendMessage.sendTextMessage(sender, reply);
                break;
            case "stop":
            case "Stop":
            case "STOP":
            case "halt":
                reply = "Sorry. You won’t get any messages from me until you write ‘start'.";
                db.saveUserPref(sender, 'breaking', false);
                sendMessage.sendTextMessage(sender, reply);
                break;
            default:
                reply = 'I do not understand this: ' + text.substring(0, 200);
                sendMessage.sendTextMessage(sender, reply);
    }}};
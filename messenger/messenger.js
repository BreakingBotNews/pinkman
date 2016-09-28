var l = require('../utilities/logUtils');
var db = require('../api/controllers/dbRequests');
var sendMessage = require('../api/controllers/SendMessages');

function received(sender, text) {
    l.d('Nachricht empfangen von '+ sender + ': ' +text);
    /*get user from DB*/
    db.userByFbId(sender, text);
}

function dodecide(text, user) {
    console.log("versuche zu entscheiden");
    //l.d('decide for user: ' + user[id]);
    /*if user is new, welcome flow*/

    //reply = 'Hi, I  once was a paper boy but got into a time wave. Now I live as an algorithm in the worldwideweb. It would be a pleasure to deliver the latest news stories to you.';

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
            db.getSummary(user['fbId'],5,function (result) {
                result = result.data;
                console.log(result);
                for (var i=0; i<result.length; i++){
                    var reply = result[i].headline+' \n'+result[i].shortURL;
                    sendMessage.sendTextMessage(user['fbId'],reply);
                }
            });
            break;
        case "start":
        case "Start":
            reply = 'You are now subscribed to all new articles.';
            db.saveUserPref(user['fbId'], 'breaking', true);
            sendMessage.sendTextMessage(user['fbId'], reply);
            break;
        case "stop":
        case "Stop":
        case "STOP":
        case "halt":
            reply = "Sorry. You won’t get any messages from me until you write ‘start'.";
            db.saveUserPref(user['fbId'], 'breaking', false);
            sendMessage.sendTextMessage(user['fbId'], reply);
            break;
        default:
            reply = 'I do not understand this: ' + text.substring(0, 200);
            sendMessage.sendTextMessage(user['fbId'], reply);
    }}

module.exports = {
    received: received,
    dodecide: dodecide
};

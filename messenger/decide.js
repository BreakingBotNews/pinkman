var l = require('../utilities/logUtils');
var sendMessage = require('../api/controllers/SendMessages');
var send = require('./send');

function dodecide(text, user) {
    console.log("versuche zu entscheiden, was der user will");
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
            console.log(user['id']);
            send.summary(user['fbId'],user['id']);
            break;
        case "start":
        case "Start":
            console.log(user['fbId']);
            reply = 'You are now subscribed to all news!';
            send.subscribe(user['fbId'], reply);
            break;
        case "stop":
        case "Stop":
        case "STOP":
        case "halt":
            reply = "Sorry. You won’t get any messages from me until you write ‘start'.";
            send.stopsubscription(user['fbId'], reply);
            break;
        default:
            reply = 'I do not understand this: ' + text.substring(0, 200);
            sendMessage.sendTextMessage(user['fbId'], reply);
    }}

module.exports = {
    dodecide: dodecide
};

var l = require('../utilities/logUtils');
var sendMessage = require('../api/controllers/SendMessages');
var send = require('./send');

function dodecide(text, user) {
    console.log("versuche zu entscheiden, was der user will");
    var reply='';
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
        case 'personal summary':
            console.log(user['id']);
            send.personalSummary(user['fbId'],user['id']);
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
        case "Settings":
        case "settings":
            reply = 'Here is the Link to the Settings:';
            send.settingsUrlGenerator(user, reply);
            break;
        case "fbLink":
        case "facebookLink":
        case "facebook link":
        case "link facebook":
        case "link fb":
            reply = 'Click this Link to connect to Facebook:';
            send.fbLinkUrlGenerator(user, reply);
            break;
        case "Get Started":
            getStarted(user);
            break;
        case "Help":
        case "help":
        case "Help me":
        case "help me":
            //ToDo
            break;
        default:
            reply = 'I do not understand this: ' + text.substring(0, 200);
            sendMessage.sendTextMessage(user['fbId'], reply);
    }}

function getStarted(user) {
    var reply;
    reply = "Welcome to breakingbot.news your personalized news bot.";
    sendMessage.sendTextMessage(user['fbId'], reply);
    setTimeout(function () {
        reply = "You can use the menu in the bottom left corner or written commands to direct me. Please be patient with me, I'm new to my job!";
        sendMessage.sendTextMessage(user['fbId'], reply);
    },100);
    setTimeout(function () {
        reply = "Please help me personalize your experience. By clicking on the button below, you can grant me permission to use some of your Facebook data. Without it I'm blind..";
        send.fbLinkUrlGenerator(user, reply);
    },200);
}

module.exports = {
    dodecide: dodecide
};

var l = require('../utilities/logUtils');
var db = require('../api/controllers/dbRequests');
var sendMessage = require('../api/controllers/SendMessages');

function summary(target) {
    console.log("getting summary");
    db.getSummary(target,5,function (result) {
        result = result.data;
        console.log(result);
        for (var i=0; i<result.length; i++){
            var reply = result[i].headline+' \n'+result[i].shortURL;
            sendMessage.sendTextMessage(user['fbId'],reply);
        }
});}

function subscribe(user, reply) {
    db.saveUserPref(user, 'breaking', true);
    sendMessage.sendTextMessage(user['fbId'], reply);
}

function stopsubscription(user, reply) {
    db.saveUserPref(user, 'breaking', false);
    sendMessage.sendTextMessage(user, reply);
}

module.exports = {
    summary: summary,
    subscribe: subscribe,
    stopsubscription: stopsubscription
};

var l = require('../utilities/logUtils');
var db = require('../api/controllers/dbRequests');
var sendMessage = require('../api/controllers/SendMessages');
var axios = require('axios');

function summary(target,id) {
    console.log("getting summary");
    db.getSummary(id,5,function (result) {
        result = result.data;
        console.log(result);
        for (var i=0; i<result.length; i++){
            var reply = result[i].headline+' \n'+result[i].shortURL;
            sendMessage.sendTextMessage(target,reply);
        }
});}

function subscribe(user, reply) {
    console.log(user);
    console.log(db);
    db.saveUserPref(user, 'breaking', true);
    console.log("Subscribe");
    sendMessage.sendTextMessage(user, reply);
}

function stopsubscription(user, reply) {
    db.saveUserPref(user, 'breaking', false);
    sendMessage.sendTextMessage(user, reply);
}

function fbLinkUrlGenerator(userObj,reply) {
    var url = "http://settings.breakingbot.news/fbLink/fbLink.html?u=";
    url +=userObj['id']+"&s="+cutString(userObj['fbId'].toString());
    
    reply+="\n"+url;
    sendMessage.sendTextMessage(userObj['fbId'], reply);
}

function settingsUrlGenerator(userObj,reply) {
    var url = "http://settings.breakingbot.news?u=";
    url +=userObj['id']+"&s="+cutString(userObj['fbId'].toString());

    reply+="\n"+url;
    sendMessage.sendTextMessage(userObj['fbId'], reply);
}

//helper
function cutString(string) {
    return string.slice(4,8);
}

module.exports = {
    summary: summary,
    subscribe: subscribe,
    stopsubscription: stopsubscription,
    fbLinkUrlGenerator: fbLinkUrlGenerator,
    settingsUrlGenerator: settingsUrlGenerator
};


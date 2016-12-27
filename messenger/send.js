var l = require('../utilities/logUtils');
var db = require('../api/controllers/dbRequests');
var sendMessage = require('../api/controllers/SendMessages');
var axios = require('axios');

function summary(target,id) {
    console.log("getting summary");
    db.getSummary(id,5,function (result) {
        result = result.data;
        sendMessage.sendTemplate(result,target);
});}

function personalSummary(target, id) {
    db.getPersonalSummary(id,10,function (result) {
        result=result.data;
        sendMessage.sendTemplate(result,target);
    })
}

function combinedSummary(target, id) {
    db.getCombinedSummary(id,10,function (result) {
        result=result.data;
        sendMessage.sendTemplate(result,target);
    })
}

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
    
    sendMessage.sendUrlButton(userObj['fbId'],url,'Connect',reply);
}

function settingsUrlGenerator(userObj,reply) {
    var url = "http://settings.breakingbot.news?u=";
    url +=userObj['id']+"&s="+cutString(userObj['fbId'].toString());
    
    sendMessage.sendUrlButton(userObj['fbId'],url,'Settings', reply);
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
    settingsUrlGenerator: settingsUrlGenerator,
    personalSummary: personalSummary,
    combinedSummary: combinedSummary
};


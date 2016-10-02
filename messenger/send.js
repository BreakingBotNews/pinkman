var l = require('../utilities/logUtils');
var db = require('../api/controllers/dbRequests');
var sendMessage = require('../api/controllers/SendMessages');
var axios = require('axios');
var config = require('../config/config.json');

var url = 'https://bot2.shaula.uberspace.de/heisenberg/api/user?apiKey='+config.apiKey;
var urlArticle = 'https://bot2.shaula.uberspace.de/heisenberg/api/article?apiKey='+config.apiKey;

function getSummary(sender, length, callback) {
    console.log("Heisenberg, was ist der neue Shizzle?");
    var obj = {
        summaryRequest: {
            length: length,
            id: sender
        }
    };
    axios.post(urlArticle,obj).then(function (result) {
        console.log('Antwort bekommen');
        console.log(result);
        callback(result);
    })
}

function summary(target,id) {
    console.log("getting summary");
    getSummary(id,5,function (result) {
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

module.exports = {
    summary: summary,
    subscribe: subscribe,
    stopsubscription: stopsubscription
};


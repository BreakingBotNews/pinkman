var l = require('../utilities/logUtils');
var db = require('../api/controllers/dbRequests');
var sendMessage = require('../api/controllers/SendMessages');
var axios = require('axios');

var url = 'https://bot2.shaula.uberspace.de/heisenberg/api/user?apiKey=pK8TyE%26f7PTdu$SkS9jDEETVMkha%26k_xzwV^sGW7FgH3n?DE';
var urlArticle = 'https://bot2.shaula.uberspace.de/heisenberg/api/article?apiKey=pK8TyE%26f7PTdu$SkS9jDEETVMkha%26k_xzwV^sGW7FgH3n?DE';

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


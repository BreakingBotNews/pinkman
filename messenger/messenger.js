var l = require('../utilities/logUtils');
var db = require('../api/controllers/dbRequests');
var sendMessage = require('../api/controllers/SendMessages');
var decide = require('./decide');

function received(sender, text) {
    l.d('Nachricht empfangen von '+ sender + ': ' +text);
    /*get user from DB*/
    db.userByFbId(sender, function (result) {
        decide.dodecide(text, result.data[0]);
    });
}

module.exports = {
    received: received,
};

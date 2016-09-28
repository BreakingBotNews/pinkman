var l = require('../utilities/logUtils');
var db = require('../api/controllers/dbRequests');
var sendMessage = require('../api/controllers/SendMessages');

function received(sender, text) {
    l.d('Nachricht empfangen von '+ sender + ': ' +text);
    /*get user from DB*/
    db.userByFbId(sender, text);
}

module.exports = {
    received: received,
};

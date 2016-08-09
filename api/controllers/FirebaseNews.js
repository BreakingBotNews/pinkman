var firebase = require('./FirebaseDatabase');
var messenger = require('../../routes/messenger');
var sendMessage = require('./SendMessages');


/*
 * All relevant operations related to news in firebase
 */

//noinspection JSUnresolvedFunction
const ref = firebase.ref('/news/guardian');

module.exports = {
    getLatestNews: function(sender, topic) {
        ref.once("value", function(snapshot) {
            //console.log(snapshot.val());
            sendMessage.sendTextMessage(sender, "Newest news: ");
            var news = snapshot.val();
            var reply = "";
            var count = 0;
            for (var prop in news) {
                if( news.hasOwnProperty( prop ) && count <= 4) {
                    sendMessage.sendTextMessage(sender,news[prop].headline + ' ' + news[prop].shortUrl);
                    count++;
                }
            }

        });
    }
};
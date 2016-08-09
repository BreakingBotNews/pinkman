var firebase = require('./FirebaseDatabase');
var messenger = require('../../routes/messenger');

/*
 * All relevant operations related to news in firebase
 */

//noinspection JSUnresolvedFunction
const ref = firebase.ref('/news');

module.exports = {
    getLatestNews: function(sender, topic) {
        var ref = firebase.ref("/news");
        ref.once("value", function(snapshot) {
            console.log(snapshot.val());
            messenger.sendTextMessage(sender, "Das ist neu:");
        });
    }
};
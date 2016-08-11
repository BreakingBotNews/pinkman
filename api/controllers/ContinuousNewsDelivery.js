var firebase = require('./FirebaseDatabase');
var messenger = require('../../routes/messenger');
var firebaseUsers = require('./FirebaseUsers');


//["10154376941170628","1043117445737068","928596807267143"];

/*
 * All relevant operations related to news in firebase
 */

//noinspection JSUnresolvedFunction
const ref = firebase.ref('/news/guardian');

module.exports = {
    watchNews: function() {
        // Retrieve new articles  as they are added to our database
        ref.orderByKey().limitToLast(3).on("child_added", function(snapshot, prevChildKey) {
            var news = snapshot.val();
            //console.log(news.headline + ' ' + news.shortUrl)
            firebaseUsers.pushActiveUsers(news.headline + ' ' + news.shortUrl)
        });
    }
};
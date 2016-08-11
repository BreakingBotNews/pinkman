var firebase = require('./FirebaseDatabase');
var sendMessage = require('./SendMessages');


/*
 * All relevant operations to save user-data to Firebase.
 */

//noinspection JSUnresolvedFunction
const ref = firebase.ref('users/');

module.exports = {
    writeUserMessage: function (userId, message) {
        var userRef = ref.child(userId + '/messages');

        userRef.push({
            message: message
        });
    },
    saveUserPref: function (userId, setting, content) {
        var userRef = ref.child(userId + '/settings');
        userRef.child(setting).set(content);

    },
    pushActiveUsers: function (message) {
        ref.once("value", function(snapshot) {
            //console.log(snapshot.val());
            var users = snapshot.val();
            //console.log(users['10154376941170628']['settings']['paused']);
            for (var user in users) {
                //console.log(user);
                if( users.hasOwnProperty( user )) {
                    if (users[user].hasOwnProperty('settings')) {
                        //console.log(users[user]['settings']);
                        if (users[user]['settings'].hasOwnProperty('paused')) {
                            if (users[user]['settings']['paused'] == false) {
                                sendMessage.sendTextMessage(user,message);
                            }
                        }
                    }
                }
            }
        });
    }

};
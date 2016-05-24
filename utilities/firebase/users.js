var firebase = require('./firebaseRef');


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
    }
};
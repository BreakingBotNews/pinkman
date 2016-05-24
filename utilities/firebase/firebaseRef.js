var config = require('../../config/config');
var l = require('../logUtils');
var firebase = require('firebase');


/**
 * Here we initilize firebase and export the database connection.
 */

firebase.initializeApp({
    serviceAccount: './config/firebase_config.json',
    databaseURL: config.firebaseDatabaseURL
});

l.d('Firebase initilized.');

const database = firebase.database();


module.exports = database;
var request = require('request');
var config = require('../../config/config');
var l = require('../../utilities/logUtils');

const fb_page_access_token = config.fb_page_access_token;
const fb_verify_token = config.fb_verify_token;

// Send message to user.
module.exports = {
    sendTextMessage: function(sender, text) {
        var messageData = {
            text: text
        };
        request({
            url: 'https://graph.facebook.com/v2.6/me/messages',
            qs: {access_token: fb_page_access_token},
            method: 'POST',
            json: {
                recipient: {id: sender},
                message: messageData
            }
        }, function (error, response) {
            if (error) {
                l.d('Error sending message: ', error);
            } else if (response.body.error) {
                l.d('Error: ', response.body.error);
            }
        })}};
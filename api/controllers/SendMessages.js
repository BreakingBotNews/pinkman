var request = require('request');
var config = require('../../config/config');
var l = require('../../utilities/logUtils');

const fb_page_access_token = config.fb_page_access_token;
const fb_verify_token = config.fb_verify_token;
const url = 'https://graph.facebook.com/v2.6/me/messages';

// Send message to user.
module.exports = {
    sendTextMessage: function(sender, text) {
        l.d("Nachricht gesendet an " + sender + ": " + text);
        var messageData = {
            text: text
        };
        request({
            url: url,
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
        });
    },
    sendTypingOn: function (sender) {
        request({
            url: url,
            qs: {access_token: fb_page_access_token},
            method: 'POST',
            json: {
                recipient: {id: sender},
                sender_action: "typing_on"
            }
        }, function (error, response) {
            if (error) {
                l.d('Error sending message: ', error);
            } else if (response.body.error) {
                l.d('Error: ', response.body.error);
            }
        });
    },
    sendTemplate: function (articles,sender) {
        var elements=[];

        for (var i=0;i<articles.length; i++){
            var element = {
                title: articles[i].headline,
                item_url: articles[i].articleURL,
                image_url: articles[i].thumbnailURL,
                subtitle: articles[i].trailText
            };
            elements[i]=element;
        }
        request({
            url: url,
            qs: {access_token: fb_page_access_token},
            method: 'POST',
            json: {
                recipient: {id: sender},
                message: {
                    attachment:{
                        type: "template",
                        payload: {
                            template_type: "generic",
                            elements: elements
                        }
                    }
                }
            }
        }, function (error, response) {
            if (error) {
                l.d('Error sending message: ', error);
            } else if (response.body.error) {
                l.d('Error: ', response.body.error);
            }
        });
    },
    sendUrlButton: function (sender, burl, title, text) {
        console.log("Button");
        request({
            url: url,
            qs: {access_token: fb_page_access_token},
            method: 'POST',
            json: {
                recipient: {id: sender},
                message: {
                    attachment:{
                        type: "template",
                        payload: {
                            template_type: "button",
                            text: text,
                            buttons:[
                                {
                                    type: "web_url",
                                    url: burl,
                                    title: title
                                }
                            ]
                        }
                    }
                }
            }
        }, function (error, response) {
            if (error) {
                l.d('Error sending message: ', error);
            } else if (response.body.error) {
                l.d('Error: ', response.body.error);
            }
        });
    }
};
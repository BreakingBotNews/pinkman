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
            var thumb = articles[i].thumbnailURL;
            if(thumb===0){
                thumb = "https://fbcdn-sphotos-a-a.akamaihd.net/hphotos-ak-xat1/v/t1.0-9/13516734_1051607708259898_3308929999027179241_n.png?oh=610c593da2028c3cabe718a6059df0c7&oe=58A6071B&__gda__=1484226323_ac278d951f2ce2c05043384eb8c40756";
            }
            elements[i]= {
                title: articles[i].headline,
                item_url: articles[i].articleURL,
                image_url: thumb,
                subtitle: articles[i].trailText,
                buttons:[
                    {
                        type: "web_url",
                        url: articles[i].articleURL,
                        title: "View in Web"
                    }
                ]
            };
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
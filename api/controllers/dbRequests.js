var axios = require('axios');
var l = require('../../utilities/logUtils');
var config = require('../../config/config.json');

var url = 'https://bot2.shaula.uberspace.de/heisenberg/api/user?apiKey='+config.apiKey;
var urlArticle = 'https://bot2.shaula.uberspace.de/heisenberg/api/article?apiKey='+config.apiKey;
const fb_page_access_token = config.fb_page_access_token;


function saveUserPref(sender, field, value){
    console.log("saveUserPref");
    if(value){
        value = 1;
    }else{
        value = 0;
    }
    console.log(value);
    var obj = {
        update: {
            condition: "fbId="+sender,
            data: {}
        }
    };
    obj.update.data[field] = value;
    console.log(obj);
    axios.post(url, obj).then(function (result) {
            //l.d(result);
           // l.d('user pref set');
        console.log(result);
        })
}

function writeUserMessage(sender, text){
    var obj = {};
    obj.write.data['id'] = sender;
    obj.write.data['message'] = text;
    
    axios.post(url,obj).then(function (result) {
        l.d('user message written');
    })
}

function getSummary(sender, length, callback) {
    var obj = {
        summaryRequest: {
            length: length,
            id: sender, 
            personal: false
        }
    };
    axios.post(urlArticle,obj).then(function (result) {
        callback(result);
    })
}

function getPersonalSummary(sender,length,callback) {
    var obj = {
        summaryRequest: {
            length: length,
            id: sender,
            personal: true
        }
    };
    axios.post(urlArticle,obj).then(function (result) {
        callback(result);
    })
}

function userById(id, fields) {
    fields = fields || [];
    var reqfields = [];
    for(var i = 0; i < fields.length; i++){
        reqfields.push = fields[i];
    }

    var reqObj = {
        query: {
            condition: "id = " + id
        },
        fields: reqfields
    };
    axios.post(url,reqObj).then(
        function (response) {
            l.d(response.data);
        });
}

function userByFbId(id, callback) {
    var reqObj = {
        query: {
            condition: "fbid = " + id
        }
    };
    axios.post(url,reqObj).then(
        function (response) {
            callback(response);
            //console.log(response.data[0]['id']);
            //console.log(text);
            //sendMessage.sendTextMessage(response.data[0]['fbId'], text);
            //decide.dodecide(text, response.data[0]); //callback
                /*
                id: 9,
                fbId: '10154376941170628',
                firstname: null,
                lastname: null,
                age: null,
                email: null,
                hometown: null,
                currentResidenz: null,
                active: 0,
                breaking: 0
                */

});
}

function createUser(fbid, callback) {
    //get info about user from facebook
    //https://graph.facebook.com/v2.6/<USER_ID>?fields=first_name,last_name,profile_pic,locale,timezone,gender&access_token=<PAGE_ACCESS_TOKEN>
    l.d("creating user");
    getUserProfile(fbid, function (result) {
        if (result) {
            l.d('got callback with data');
            var reqObj = {
                write: {
                    data: {
                        "fbId": fbid,
                        "firstname": result['first_name'],
                        "lastname": result['last_name'],
                        "locale": result['locale'],
                        "timezone": result['timezone'],
                        "gender": result['gender']
                    }
                }
            };
            axios.post(url,reqObj)
                .then(
                function (response) {
                    //if response success, give user data back TODO
                    callback(reqObj.write.data, response.data.insertId);
                })
                .catch(function (error) {
                    l.d(error);
                });
        }
        else {
            l.d("no callback data");
        }
    });
}

function getUserProfile (fbid, callback) {
    l.d("getting fb date for " + fbid);
    furl = 'https://graph.facebook.com/v2.6/'+fbid+'?fields=first_name,last_name,profile_pic,locale,timezone,gender&access_token=' + fb_page_access_token;
    l.d(url);
    axios.get(furl)
        .then(
        function (response) {
            callback(response.data)
        })
        .catch(function (error) {
          //  l.d(error);
        });
}

module.exports = {
    saveUserPref: saveUserPref,
    writeUserMessage: writeUserMessage,
    getSummary: getSummary,
    userById: userById,
    userByFbId: userByFbId,
    createUser: createUser,
    getPersonalSummary: getPersonalSummary
};
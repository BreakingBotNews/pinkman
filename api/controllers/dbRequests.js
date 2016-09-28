var axios = require('axios');
var l = require('../../utilities/logUtils');

var url = 'https://bot2.shaula.uberspace.de/heisenberg/api/user?apiKey=pK8TyE%26f7PTdu$SkS9jDEETVMkha%26k_xzwV^sGW7FgH3n?DE';
var urlArticle = 'https://bot2.shaula.uberspace.de/heisenberg/api/article?apiKey=pK8TyE%26f7PTdu$SkS9jDEETVMkha%26k_xzwV^sGW7FgH3n?DE';

function saveUserPref(sender, field, value){
    if(value){
        value = 1;
    }else{
        value = 0;
    }
    var obj = {
        update: {
            condition: "fbId="+sender,
            data: {}
        }
    };
    obj.update.data[field] = value;
    axios.post(url, obj).then(function (result) {
            //l.d(result);
            l.d('user pref set');
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
            fbId: sender
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
    axios.post('https://bot2.shaula.uberspace.de/heisenberg/api/user?apiKey=pK8TyE%26f7PTdu$SkS9jDEETVMkha%26k_xzwV^sGW7FgH3n?DE',reqObj).then(
        function (response) {
            l.d(response.data);
        });
}

function userByFbId(id, text, callback) {
    var reqObj = {
        query: {
            condition: "fbid = " + id
        }
    };
    axios.post('https://bot2.shaula.uberspace.de/heisenberg/api/user?apiKey=pK8TyE%26f7PTdu$SkS9jDEETVMkha%26k_xzwV^sGW7FgH3n?DE',reqObj).then(
        function (response) {
            callback(text, response.data[0]);
            //console.log(response.data[0]['id'])
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

module.exports = {
    saveUserPref: saveUserPref,
    writeUserMessage: writeUserMessage,
    getSummary: getSummary,
    userById: userById,
    userByFbId: userByFbId
};
var axios = require('axios');
var l = require('../../utilities/logUtils');

var url = 'https://bot2.shaula.uberspace.de/heisenberg/api/user?apiKey=pK8TyE%26f7PTdu$SkS9jDEETVMkha%26k_xzwV^sGW7FgH3n?DE';

function saveUserPref(sender, field, value){
    if(value){
        value = 1;
    }else{
        value = 0;
    }
    var obj = {
        update: {
            condition: sender,
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

module.exports = {
    saveUserPref: saveUserPref,
    writeUserMessage: writeUserMessage
};
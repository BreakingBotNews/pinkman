var axios = require('axios');
var l = require('../../utilities/logUtils');


module.exports = {
    byId: function(id, fields) {
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
        axios.post('http://localhost:8080/api/user?apiKey=pK8TyE%26f7PTdu$SkS9jDEETVMkha%26k_xzwV^sGW7FgH3n?DE',reqObj).then(
            function (response) {
                l.d(response.data);
            });
    }
};
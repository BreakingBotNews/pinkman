var fs = require('fs');

/**
 * Logging utilities.
 */

module.exports = {

    // Simple logging to the server console.
    d: function (input) {
        console.log(input.toString());

        fs.appendFile('log.txt', new Date().toString() + ': ' + input.toString()+'\n', function (err) {
        });
    }
};
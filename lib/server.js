var http = require('http');

var port = 7654;
module.exports = function(cb) {
    http.createServer(cb).listen(port);
    console.log('Started server on port ' + port);
};


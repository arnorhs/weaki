var fs = require('fs');
var markdown = require('marked');
var template = require('../template');
var respond = require('../respond');

// obviously this needs improvements
module.exports = function(file, res) {
    fs.readFile(file, 'utf-8', function(err, data) {
        if (err) {
            return respond(500, res);
        }
        var content = template('markdown', {
            content: markdown(data)
        });
        res.setHeader('content-type', 'text/html');
        res.statusCode = 200;
        res.end(content);
    });
};


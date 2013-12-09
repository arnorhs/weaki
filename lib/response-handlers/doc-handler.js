var fs = require('fs');
var markdown = require('marked');
var template = require('../template');
var respond = require('../respond');

// obviously this needs improvements
module.exports = function(file, res) {
    fs.readFile(file, 'utf-8', function(err, data, ext) {
        if (err) {
            return respond(500, res);
        }
        if (ext === 'markdown' || ext === 'md') {
            data = markdown(data);
        }
        // XXX for html we might want to strip everything besides the body
        var content = template('doc', {
            content: data
        });
        res.setHeader('content-type', 'text/html');
        res.statusCode = 200;
        res.end(content);
    });
};


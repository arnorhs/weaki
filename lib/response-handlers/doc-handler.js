var fs = require('fs');
var path = require('path');
var markdown = require('marked');
var template = require('../template');
var respond = require('../respond');

// obviously this needs improvements
module.exports = function(opts) {
    return function(file, res, ext, breadcrumbs) {
        fs.readFile(file, 'utf-8', function(err, data) {
            if (err) {
                return respond(500, res);
            }
            if (ext === 'markdown' || ext === 'md') {
                data = markdown(data);
            } else {
                data = '<h1>' + path.basename(file) + '</h1><div class="text-document">' + data + '</div>';
            }
            // XXX for html we might want to strip everything besides the body
            var content = template('doc', {
                title: opts.title,
                breadcrumbs: breadcrumbs,
                content: data
            });
            res.setHeader('content-type', 'text/html');
            res.statusCode = 200;
            res.end(content);
        });
    };
};

var path = require('path');
var fs = require('fs');
var template = require('../template');
var respond = require('../respond');
var match = require('minimatch');

function renderFiles(curr, files) {
    return template('listing', curr, {
        files: files.map(function(file) {
            if (match(file, '.*')) {
                return null;
            }
            return {
                name: file,
                path: "/" + path.relative(curr.opts.rootDir, path.resolve(curr.file, file))
            };
        }).filter(Boolean)
    });
}

module.exports = function(res, curr) {
    fs.readdir(curr.file, function(err, files) {
        if (err) {
            return respond(500, res);
        }
        var content = renderFiles(curr, files);
        res.setHeader('content-type', 'text/html');
        res.statusCode = 200;
        res.end(content);
    });
};

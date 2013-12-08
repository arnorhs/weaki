var path = require('path');
var fs = require('fs');
var template = require('./template');
var respond = require('./respond');
var match = require('minimatch');

function renderFiles(rootDir, dir, files) {
    return template('listing', {
        files: files.map(function(file) {
            if (match(file, '.*')) {
                return null;
            }
            return {
                name: file,
                path: "/" + path.relative(rootDir, path.resolve(dir, file))
            };
        }).filter(Boolean)
    });
}

module.exports = function(rootDir) {
    return function(dir, res) {
        fs.readdir(dir, function(err, files) {
            if (err) {
                return respond(500, res);
            }
            var content = renderFiles(rootDir, dir, files);
            res.setHeader('content-type', 'text/html');
            res.statusCode = 200;
            res.end(content);
        });
    };
};

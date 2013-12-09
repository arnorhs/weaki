var path = require('path');
var fs = require('fs');
var template = require('../template');
var respond = require('../respond');
var match = require('minimatch');

function renderFiles(rootDir, dir, files, title, breadcrumbs) {
    return template('search', {
        title: title,
        breadcrumbs: breadcrumbs,
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

module.exports = function(opts, search) {
    return function(q, res, breadcrumbs) {
        if (!q) {
            return respond(500, res);
        }
        var content = render(search(q));
        res.setHeader('content-type', 'text/html');
        res.statusCode = 200;
        res.end(content);
    };
};

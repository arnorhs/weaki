var server = require('./lib/server.js');
var path = require('path');
var respond = require('./lib/respond');
var fs = require('fs');
var handlers = require('./lib/response-handlers');

module.exports = function(opts) {
    // XXX Add xtend or something to do this
    opts = opts || {};
    opts.rootDir = opts.rootDir || process.cwd();
    server(requestHandler(opts));
};

// if node index.js was called, start inline with no options
if (!module.parent) {
    module.exports();
}

function urler(url) {
    var parts = url.split('?');
    var url = parts[0].replace(/\.\./g, '').substr(1);
    return {
        qs: parts[1] ? querystring.parse(parts[1]) : '',
        url: url
    };
}

function requestHandler(opts) {
    var h = handlers(opts.rootDir);

    return function(req, res) {
        var url = urler(req.url);
        var file = path.resolve(opts.rootDir, url.url);
        console.log(req.method + ": " + file);

        if (url.url === "weaki-search") {
            res.statusCode = 200;
            res.end('search');
            return;
        }

        fs.stat(file, function(err, stat) {
            if (err) {
                if (err && err.code === 'ENOENT') {
                    return respond(404, res);
                } else {
                    console.log(err.stack);
                    return respond(500, res);
                }
            }

            var ext = path.extname(file).substr(1).toLowerCase();
            if (ext === 'md' || ext === 'markdown') {
                h.doc(file, res, ext);
                return;
            }

            if (stat.isDirectory()) {
                h.dir(file, res);
                return;
            }

            h.file(file, stat, req, res);
        });
    }
}

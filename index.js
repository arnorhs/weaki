var server = require('./lib/server.js');
var path = require('path');
var respond = require('./lib/respond');
var fs = require('fs');

var rootDir = process.cwd();

var handlers = require('./lib/response-handlers/')(rootDir);

function urler(url) {
    var parts = url.split('?');
    var url = parts[0].replace(/\.\./g, '').substr(1);
    return {
        qs: parts[1] ? querystring.parse(parts[1]) : '',
        url: url
    };
}

server(function(req, res) {

    var url = urler(req.url);
    var file = path.resolve(rootDir, url.url);
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
            handlers.markdown(file, res);
            return;
        }

        if (stat.isDirectory()) {
            handlers.dir(file, res);
            return;
        }

        handlers.file(file, stat, req, res);
    });
});

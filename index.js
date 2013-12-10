var http = require('http');
var path = require('path');
var respond = require('./lib/respond');
var fs = require('fs');
var h = require('./lib/response-handlers');
var querystring = require('querystring');
var searchIndex = require('./lib/search/');

module.exports = function(opts) {
    // XXX Add xtend or something to do this
    if (!opts) {
        throw new Error("Options are not optional for starting weaki");
    }

    searchIndex.startIndexing(opts);

    http.createServer(requestHandler(opts)).listen(opts.port);
    console.log('Started server on port ' + opts.port + ' in directory ' + opts.rootDir);
};

// if node index.js was called, start inline with no options
if (!module.parent) {
    module.exports();
}

function current(req, opts) {
    var parts = req.url.split('?');
    var url = unescape(parts[0].replace(/\.\./g, '')).replace(/^\/+/, '');
    var file = path.resolve(opts.rootDir, url);
    return {
        qs: parts[1] ? querystring.parse(parts[1]) : {},
        url: url,
        file: file,
        opts: opts
    };
}

function requestHandler(opts) {
    return function(req, res) {
        var curr = current(req, opts);

        console.log(req.method + ": " + curr.file);

        if (curr.url === "weaki-search") {
            h.search(res, curr);
            return;
        }

        fs.stat(curr.file, function(err, stat) {
            if (err) {
                if (err && err.code === 'ENOENT') {
                    return respond(404, res);
                } else {
                    console.log(err.stack);
                    return respond(500, res);
                }
            }
            curr.stat = stat;

            curr.ext = path.extname(curr.file).substr(1).toLowerCase();
            if (opts.inlineExt.indexOf(curr.ext) !== -1) {
                h.doc(res, curr);
                return;
            }

            if (stat.isDirectory()) {
                h.dir(res, curr);
                return;
            }

            h.file(req, res, curr);
        });
    };
}

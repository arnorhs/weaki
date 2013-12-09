var http = require('http');
var path = require('path');
var respond = require('./lib/respond');
var fs = require('fs');
var handlers = require('./lib/response-handlers');
var querystring = require('querystring');

module.exports = function(opts) {
    // XXX Add xtend or something to do this
    if (!opts) {
        throw new Error("Options are not optional for starting weaki");
    }

    http.createServer(requestHandler(opts)).listen(opts.port);
    console.log('Started server on port ' + opts.port + ' in directory ' + opts.rootDir);
};

// if node index.js was called, start inline with no options
if (!module.parent) {
    module.exports();
}

function generateBreadcrumbs(rootDir, file) {
    var relative = path.relative(rootDir, file);
    var root = { title: "home", url: "/" };
    if (relative === "") {
        return [root];
    }
    var paths = relative.split("/");
    var last = "";
    var breadcrumbs = paths.map(function(section) {
        return {
            title: section || "/",
            url: (last = last + "/" + section)
        };
    });
    breadcrumbs.unshift(root);
    return breadcrumbs;
}

function urler(url) {
    var parts = url.split('?');
    url = unescape(parts[0].replace(/\.\./g, '').substr(1));
    return {
        qs: parts[1] ? querystring.parse(parts[1]) : '',
        url: url
    };
}

function requestHandler(opts) {
    var h = handlers(opts);

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
            if (opts.inlineExt.indexOf(ext) !== -1) {
                h.doc(file, res, ext, generateBreadcrumbs(opts.rootDir, file));
                return;
            }

            if (stat.isDirectory()) {
                h.dir(file, res, generateBreadcrumbs(opts.rootDir, file));
                return;
            }

            h.file(file, stat, req, res);
        });
    };
}

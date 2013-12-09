var server = require('./lib/server.js');
var path = require('path');
var respond = require('./lib/respond');
var fs = require('fs');
var handlers = require('./lib/response-handlers');
var querystring = require('querystring');

module.exports = function(opts) {
    // XXX Add xtend or something to do this
    opts = opts || {};
    opts.rootDir = opts.rootDir || process.cwd();
    opts.inlineExt = opts.inlineExt || ['md', 'markdown', 'txt'];
    opts.title = opts.title || "weaki";
    server(requestHandler(opts));
};

// if node index.js was called, start inline with no options
if (!module.parent) {
    module.exports();
}

function generateBreadcrumbs(opts, file) {
    var relative = path.relative(opts.rootDir, file);
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
    return {
        qs: parts[1] ? querystring.parse(parts[1]) : '',
        url: parts[0].replace(/\.\./g, '').substr(1)
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
                h.doc(file, res, ext, generateBreadcrumbs(opts, file));
                return;
            }

            if (stat.isDirectory()) {
                h.dir(file, res, generateBreadcrumbs(opts, file));
                return;
            }

            h.file(file, stat, req, res);
        });
    };
}

/* logic blatently copied from ecstatic's:
 * https://github.com/jesusabdullah/node-ecstatic/blob/master/lib/ecstatic.js
 */

var mime = require('mime');
var Etag = require('./etag');
var respond = require('./respond');
var fs = require('fs');

module.exports = function(file, stat, req, res) {
    var statEtag = new Etag(stat);

    res.setHeader('etag', statEtag.etag);
    res.setHeader('last-modified', (new Date(stat.mtime)).toUTCString());
    res.setHeader('cache-control', 'max-age=3600');

    // Return a 304 if necessary
    if (statEtag.isNotModified(req.headers)) {
        return respond(304, res);
    }

    res.setHeader('content-length', stat.size);

    // Do a MIME lookup, fall back to octet-stream and handle gzip
    // special case.
    var contentType = mime.lookup(file), charSet;

    if (contentType) {
        charSet = mime.charsets.lookup(contentType);
        if (charSet) {
            contentType += '; charset=' + charSet;
        }
    }

    res.setHeader('content-type', contentType || 'application/octet-stream');

    if (req.method === "HEAD") {
        res.statusCode = req.statusCode || 200; // overridden for 404's
        return res.end();
    }

    var stream = fs.createReadStream(file);

    stream.pipe(res);
    stream.on('error', function (err) {
        respond(500, res);
    });

    stream.on('end', function () {
        respond(200, res);
    });
}

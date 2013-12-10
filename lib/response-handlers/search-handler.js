var path = require('path');
var template = require('../template');
var respond = require('../respond');
var searchIndex = require('../search/');

module.exports = function(res, curr) {
    var q = curr.qs.q;
    if (!q) {
        return respond(500, res);
    }
    var content = renderResults(curr, q, searchIndex.query(q));
    res.setHeader('content-type', 'text/html');
    res.statusCode = 200;
    res.end(content);
};

function renderResults(curr, q, results) {
    return template('search', curr, {
        query: q,
        results: results.map(function(item) {
            var url = "/" + path.relative(curr.opts.rootDir, item.key);
            return {
                name: path.basename(item.key),
                url: url,
                dir: path.dirname(url)
            };
        })
    });
}

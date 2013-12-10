/**
 * Indexdes files in the current folder -- kind of a singleton -- ie. global state
 */
var path = require('path');
var fs = require('fs');
var Index = require('node-index');
var Glob = require('glob').Glob;

var index = new Index();

module.exports = {
    startIndexing: function(opts) {
        console.log('Starting to index files for search...');

        // XXX is there a way to define multiple extensions with glob?
        var glob = new Glob('**/*.*', {
            cwd: opts.rootDir,
            nonull: false,
            nosort: true
        });

        glob.on('match', function(match) {
            var ext = path.extname(match).substr(1);
            if (opts.inlineExt.indexOf(ext) !== -1) {
                var fullPath = opts.rootDir + "/" + match;
                index.addDocument(fullPath, {
                    title: path.basename(fullPath),
                    content: fs.readFileSync(fullPath, 'utf-8')
                });
            }
        });

        glob.on('end', function(matches) {
            console.log("Search index ready. Indexed " + matches.length + " files.");
        });
    },

    query: function(query) {
        return index.query(query);
    }
};

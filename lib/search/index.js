// Indexdes files in the current folder -- kind of a singleton -- ie. global state

var path = require('path');
var fs = require('fs');
var Index = require('node-index');
var fileTree = require('file-tree-sync');
var treeHasher = require('./tree-hasher.js');

var index = new Index();

module.exports = {
    startIndexing: function(opts) {
        var treeHash = treeHasher(fileTree(opts.rootDir, [".*"]));

        for (var key in treeHash) {
            var ext = path.extname(key).substr(1);
            // no directories and only index files with the inlined extensions
            if (!treeHash[key].files && opts.inlineExt.indexOf(ext) !== -1) {
                var fullPath = opts.rootDir + "/" + key;
                console.log("indexing " + fullPath);
                index.addDocument(fullPath, {
                    title: path.basename(fullPath),
                    content: fs.readFileSync(fullPath, 'utf-8')
                });
            }
        }
    },

    query: function(query) {
        return index.query(query);
    }
};

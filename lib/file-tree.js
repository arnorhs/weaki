var readDir = require('file-tree-sync');
var indexer = require('./file-indexer.js');

var tree = readDir(process.cwd(), [".*"]);
module.exports = {
    // regex to hide files starting with .
    tree: tree,
    index: indexer(tree)
};

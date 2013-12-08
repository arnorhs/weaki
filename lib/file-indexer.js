function indexFiles(index, file) {
    index[file.relativePath] = file;
    if (file.files) {
        index = file.files.reduce(indexFiles, index);
    }
    return index;
}

module.exports = function(files) {
    return files.reduce(indexFiles, {"/": {name: "/", relativePath: "", files: files}});
};

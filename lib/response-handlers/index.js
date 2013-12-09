module.exports = function(rootDir) {
    return {
        file: require('./file-handler'),
        dir: require('./dir-handler')(rootDir),
        markdown: require('./markdown-handler')
    };
};

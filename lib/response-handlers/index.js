module.exports = function(opts) {
    return {
        file: require('./file-handler'),
        dir: require('./dir-handler')(opts),
        doc: require('./doc-handler')(opts)
    };
};

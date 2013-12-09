function Etag(stat) {
    this.etag = JSON.stringify([stat.ino, stat.size, stat.mtime].join('-'));
    this.mtime = stat.mtime;
}
Etag.prototype.isNotModified = function(headers) {
    return headers && (
        headers['if-none-match'] === this.etag
        || new Date(Date.parse(headers['if-modified-since'])) >= this.mtime
    );
};

module.exports = Etag;

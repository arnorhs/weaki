var responders = {
    // ok
    "200": function(res) {
        res.end();
    },

    // not modified
    "304": function(res) {
        res.end();
    },

    // Bad request
    "400": function(res) {
        res.end('Malformed request.');
    },

    // Access denied
    "403": function(res) {
        if (res.writable) {
            res.setHeader('content-type', 'text/plain');
            res.end('ACCESS DENIED');
        }
    },

    // not found
    "404": function(res) {
        if (res.writable) {
            res.setHeader('content-type', 'text/plain');
            res.end('404 not found');
        }
    },

    // disallowed method
    "405": function(res) {
        res.setHeader('allow', 'GET, HEAD');
        res.end();
    },

    // error
    "500": function(res) {
        res.end("Error");
    }
};

module.exports = function(statusCode, res) {
    res.statusCode = statusCode;

    if (responders[statusCode]) {
        responders[statusCode](res);
    }
};

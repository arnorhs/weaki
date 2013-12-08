var path = require('path');
var fs = require('fs');
var jade = require('jade');

var templates = {};
function getTemplate(name) {
    if (!templates[name]) {
        var file = path.normalize(__dirname + '/../.weaki/' + name + '.jade');
        var contents = fs.readFileSync(file, 'utf-8');
        templates[name] = jade.compile(contents, {
            filename: file
        });
    }
    return templates[name];
}

module.exports = function(name, locals) {
    var template = getTemplate(name);
    if (!template) {
        throw new Error("Template not found: " + name);
    }
    return template(locals);
};

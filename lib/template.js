var path = require('path');
var fs = require('fs');
var jade = require('jade');

module.exports = function(name, curr, locals) {
    var template = getTemplate(name);
    if (!template) {
        throw new Error("Template not found: " + name);
    }
    locals.title = curr.opts.title;
    locals.breadcrumbs = generateBreadcrumbs(curr);
    return template(locals);
};

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

function generateBreadcrumbs(curr) {
    var relative = path.relative(curr.opts.rootDir, curr.file);
    var root = { title: "home", url: "/" };
    if (relative === "") {
        return [root];
    }
    var paths = relative.split("/");
    var last = "";
    var breadcrumbs = paths.map(function(section) {
        return {
            title: section || "/",
            url: (last = last + "/" + section)
        };
    });
    breadcrumbs.unshift(root);
    return breadcrumbs;
}

var args = require('optimist').argv;
var fs = require('fs');

if (args.version || args.v) {
    console.log(require('../package.json').version);
    process.exit();
} else if (args.help || args.h) {
    console.log(fs.readFileSync(__dirname + '/../res/help.txt', 'utf-8'));
    process.exit();
} else {
    require('../');
}

var args = require('optimist').argv;
var fs = require('fs');
var path = require('path');
var dirCopy = require('directory-copy');

if (args.version || args.v) {
    console.log(require('../package.json').version);
    process.exit();
} else if (args.help || args.h) {
    console.log(fs.readFileSync(__dirname + '/../res/help.txt', 'utf-8'));
    process.exit();
}

var argsDir = args.dir || args.chdir;
var dir = argsDir ? path.resolve(process.cwd(), argsDir) : process.cwd();
if (!fs.existsSync(dir)) {
    console.log("Directory does not exist: " + dir);
    process.exit(1);
}

var weakiDir = dir + "/.weaki";
var weakiExists = fs.existsSync(weakiDir);
var command = args._[0] || 'start';

switch (command) {
    case 'init':
        if (weakiExists) {
            console.log(".weaki directory already exists in this location: " + dir);
            process.exit(1);
        } else {
            fs.mkdirSync(weakiDir);
            dirCopy({
                src: path.resolve(__dirname, "../.weaki"),
                dest: weakiDir
            }, function(err) {
                if (err) {
                    console.log(err.stack);
                    process.exit(1);
                }
                console.log("Initialized " + dir);
            });
        }
        break;
    case 'start':
        if (!weakiExists) {
            console.log("Missing .weaki directory in this location: " + dir);
            console.log("Please run weaki with the 'init' command to initialize the directory");
            process.exit(1);
        } else {
            var opts = require(weakiDir + "/config.json");
            opts.rootDir = dir;
            require('../')(opts);
        }
        break;
    default:
        console.log("Unrecognized command: " + command);
}

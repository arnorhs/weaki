# weaki

A simple file based wiki web server that doubles as a static file server with built-in
search index

### Main features

- Easy to customize layout and style
- Doubles as a static file server
- Inteded to work well as a git-based wiki
- Built in really nice search

### Usage

Install using npm:

```sh
$ npm install weaki -g
```

Start it up for a given directory:

```sh
$ cd projects/my_wiki_directory
$ weaki init
$ weaki start
```

Note: When you run `weaki init`, it creates a directory in the current working directory
named `.weaki`. Inside of it are jade templates and a stylesheet, so you can customize it
relatively easily.

There is also a config.json file where you can set the following options:

- `inlineExt`: define a list of file extensions to inline in the wiki - eg. if you want
  to inline html documents, which are not inlined by default (default ['md', 'markdown', 'txt'])
- `title`: The title of your wiki
- `port`: Port to run the webserver at

### Command line options

```sh
Usage: weaki <command> [options]

Commands:
  weaki completion   generate completion script
  weaki init [dir]   Initialize the current directory with the default template
                     and config.
  weaki start [dir]  Starts the web server with the specified directory (or
                     current directory if none is specified (this is the default
                     command)

Options:
  --help     Show help
  --version  Show version number

```

Pull requests welcome

### Todo

- Add tests
- Static builds
- Command line options for starting weaki without a config
- yml file for config
- maybe allow the config file itself to sit in the root
- being able to overwrite anything with a config, including where
  everything is located etc
- Colored console output
- Echoing out the served address (Possibly also opening?)
- Watching for file changes
- Replace jade with pug or something

### License

MIT license

# weaki

A simple file based markdown wiki server.

### Main features
- Easy to customize the style
- Serves up other kinds of files as well
- Inteded to work well as a git-based wiki
- Built in search

### Usage

Install using npm:
```sh
$ npm install weaki -g
```

Start it up for a given directory:
```sh
$ cd projects/my_wiki_directory
$ weaki
```

Note: First time you run weaki, it creates a directory in the current working directory
named `.weaki`. Inside of it are jade templates and a stylesheet, so you can customize it
relatively easily.

There is also a config.json file where you can set the following options:
- `inline-types`: define a list of file extensions to inline in the wiki - eg. if you want
  to inline html documents, which are not inlined by default (default ['md', 'markdown'])

### Command line options
```sh
Usage: weaki [directory] [options]

Options:
  --version     Prints out the current version

### Todo
- Use config.json
- Implement the init command
- Add breadcrumbs
- Add search

### License
MIT license

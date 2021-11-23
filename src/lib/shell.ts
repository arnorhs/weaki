import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import fs from 'fs'
import path from 'path'
import dirCopy from 'directory-copy'
import { start } from './start'

const sourceRoot = path.resolve(__dirname, '..')

const exit = (msg: string, exitCode: number = 1) => {
  console.error(msg)
  process.exit(exitCode)
}

interface Dir {
  path: string
  exists: boolean
}

interface Meta {
  config: Dir
  root: Dir
}

const getMeta = (pathArg: string) => {
  const rootPath = path.resolve(process.cwd(), pathArg)
  const configPath = `${rootPath}/.weaki`

  return {
    config: {
      exists: fs.existsSync(configPath),
      path: configPath,
    },
    root: {
      exists: fs.existsSync(rootPath),
      path: rootPath,
    },
  }
}

export const shell = () => {
  yargs(hideBin(process.argv))
    .usage('Usage: $0 <command> [options]')
    .completion('completion', (current, argv) => ['start', 'init'])
    .demandCommand()
    .command(
      'init [dir]',
      'Initialize the current directory with the default template and config.',
      (yargs) => {
        yargs.positional('dir', {
          describe: 'Directory to start Weaki in',
          default: process.cwd(),
        })
      },
      ({ dir }: { dir: string }) => {
        const { config, root } = getMeta(dir)

        if (config.exists) {
          exit('.weaki directory already exists in: ' + root.path)
        }

        fs.mkdirSync(config.path)

        console.log({
          src: path.resolve(sourceRoot, './.weaki'),
          dest: config.path,
        })

        dirCopy(
          {
            src: path.resolve(sourceRoot, './.weaki'),
            dest: config.path,
          },
          (err: Error | undefined) => {
            if (err) {
              console.error('wtf is going on')
              console.error(err)
              exit(err.stack ?? '')
            }

            console.log('Initialized ' + config.path)
          },
        )
      },
    )
    .command(
      'start [dir]',
      'Starts the web server with the specified directory (or current ' +
        'directory if none is specified (this is the default command)',
      (yargs) => {
        yargs.positional('dir', {
          describe: 'Directory to start Weaki in',
          default: process.cwd(),
        })
      },
      ({ dir }: { dir: string }) => {
        const { config, root } = getMeta(dir)
        if (!config.exists) {
          exit('Directory has not been initialized: ' + root.path)
        } else if (!root.exists) {
          exit('Directory does not exist: ' + root.path)
        }

        start({
          templateRootPath: config.path,
          ...require(config.path + '/config.json'),
          rootDir: root.path,
        })
      },
    )
    .parse()
}

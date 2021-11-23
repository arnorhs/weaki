import path from 'path'
import fs from 'fs'
import { Index } from 'node-index'
import { Glob } from 'glob'
import { WeakiOptions } from '../types'

export class SearchIndex {
  index: Index<Record<string, string>>

  constructor() {
    this.index = new Index()
  }

  startIndexing(opts: WeakiOptions) {
    console.log('Starting to index files for search...')

    // XXX is there a way to define multiple extensions with glob?
    const glob = new Glob('**/*.*', {
      cwd: opts.rootDir,
      nonull: false,
      nosort: true,
    })

    glob.on('match', (match) => {
      const ext = path.extname(match).substr(1)
      if (opts.inlineExt.indexOf(ext) !== -1) {
        const fullPath = opts.rootDir + '/' + match
        this.index.addDocument(fullPath, {
          title: path.basename(fullPath),
          content: fs.readFileSync(fullPath, 'utf-8'),
        })
      }
    })

    glob.on('end', (matches) => {
      console.log('Search index ready. Indexed ' + matches.length + ' files.')
    })
  }

  query(q: string) {
    return this.index.query(q)
  }
}

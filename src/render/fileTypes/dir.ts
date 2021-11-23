import path from 'path'
import match from 'minimatch'
import { ForRendering } from '../types'

export const renderDir = (files: string[], rootDir: string, filepath: string): ForRendering => ({
  name: 'listing',
  locals: {
    files: files
      .map((file) => {
        if (match(file, '.*')) {
          return null
        }

        return {
          name: file,
          path: '/' + path.relative(rootDir, path.resolve(filepath, file)),
        }
      })
      .filter(Boolean),
  },
})

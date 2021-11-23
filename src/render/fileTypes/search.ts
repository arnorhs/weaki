import path from 'path'
import { ForRendering } from '../types'

export const renderSearchResults = (
  rootDir: string,
  query: string,
  results: { key: string }[],
): ForRendering => ({
  name: 'search',
  locals: {
    query,
    results: results.map(function (item) {
      const url = '/' + path.relative(rootDir, item.key)

      return {
        name: path.basename(item.key),
        url: url,
        dir: path.dirname(url),
      }
    }),
  },
})

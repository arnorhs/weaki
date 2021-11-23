import path from 'path'
import { Breadcrumb } from './types'

export const generateBreadcrumbs = (rootDir: string, currentFile: string): Breadcrumb[] => {
  const relative = path.relative(rootDir, currentFile)

  const paths = relative.split('/')

  return paths.reduce<Breadcrumb[]>(
    (acc, section) => {
      acc.push({
        title: section || '/',
        url: `${acc[acc.length - 1].url}${section}/`,
      })

      return acc
    },
    [{ title: 'home', url: '/' }],
  )
}

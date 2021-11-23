import path from 'path'
import { IncomingMessage, ServerResponse } from 'http'
import { stat as fsStat } from 'fs/promises'
import { WeakiOptions } from '../types'
import { ReqContext } from './types'

export const createReqContext = async (
  req: IncomingMessage,
  opts: WeakiOptions,
  res: ServerResponse,
): Promise<ReqContext> => {
  const pathInfo = createPathInfo(req)

  const fileInfo = await createFileInfo(opts.rootDir, pathInfo.url)

  return {
    pathInfo,
    fileInfo,
    req,
    res,
  }
}

const createPathInfo = (req: IncomingMessage): ReqContext['pathInfo'] => {
  const parts = req.url?.split('?') ?? []
  const url = unescape(parts[0].replace(/\.\./g, '')).replace(/^\/+/, '')
  const qs = parts[1] ? new URLSearchParams(parts[1]) : null

  return {
    qs,
    url,
  }
}

const createFileInfo = async (rootDir: string, url: string): Promise<ReqContext['fileInfo']> => {
  if (url === 'weaki-search') {
    // TODO: this type
    // will never be needed for weaki-search
    // would be nice to figure out a more typed way of expressing it being required in
    // some places and not others
    return {
      rootDir,
      file: 'Search',
    } as ReqContext['fileInfo']
  }

  const file = path.resolve(rootDir, url)
  const stat = await fsStat(file)

  const ext = path.extname(file).substr(1).toLowerCase()

  return {
    file,
    stat,
    ext,
    rootDir,
  }
}

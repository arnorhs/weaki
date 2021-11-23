import { IncomingMessage, ServerResponse } from 'http'
import fs from 'fs'

export interface ReqContext {
  fileInfo: {
    file: string
    stat: fs.Stats
    ext: string
    rootDir: string
  }
  pathInfo: {
    qs: URLSearchParams | null
    url: string
  }
  req: IncomingMessage
  res: ServerResponse
}

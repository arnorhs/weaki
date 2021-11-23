import fs, { Stats } from 'fs'
import { IncomingMessage } from 'http'

export class Etag {
  etag: string
  mtime: Stats['mtime']

  constructor(stat: Stats) {
    this.etag = JSON.stringify([stat.ino, stat.size, stat.mtime].join('-'))
    this.mtime = stat.mtime
  }

  isNotModified(headers: IncomingMessage['headers']) {
    return (
      headers &&
      (headers['if-none-match'] === this.etag ||
        new Date(Date.parse(headers['if-modified-since'] ?? 'UNPARSABLE')) >= this.mtime)
    )
  }
}

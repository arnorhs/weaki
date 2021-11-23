import { IncomingMessage, ServerResponse } from 'http'
import { lookup, charsets } from 'mime'
import { Etag } from '../util/Etag'

import { respond } from './respond'
import { ReqContext } from '../requestContext'
import fs from 'fs'
import { readdir } from 'fs/promises'
import {
  renderDir,
  renderMdDoc,
  renderSearchResults,
  renderTextDoc,
  TemplateLoader,
} from '../../render'
import { generateBreadcrumbs } from '../../render/generateBreadcrumbs'
import { ForRendering } from '../../render/types'
import { readFileData } from '../util/readFileData'
import { SearchIndex } from '../search'

export class Controller {
  private readonly templateLoader: TemplateLoader
  private readonly searchIndex: SearchIndex

  constructor(searchIndex: SearchIndex, templateLoader: TemplateLoader) {
    this.templateLoader = templateLoader
    this.searchIndex = searchIndex
  }

  private renderContent(fileInfo: ReqContext['fileInfo'], forRendering: ForRendering) {
    return this.templateLoader.getTemplate(forRendering.name, {
      title: fileInfo.file,
      breadcrumbs: generateBreadcrumbs(fileInfo.rootDir, fileInfo.file),
      ...forRendering.locals,
    })
  }

  async directory({ res, fileInfo }: ReqContext) {
    const files = await readdir(fileInfo.file)

    const content = this.renderContent(fileInfo, renderDir(files, fileInfo.rootDir, fileInfo.file))
    res.setHeader('Content-type', 'text/html')
    res.statusCode = 200
    res.end(content)
  }

  // obviously this needs improvements
  async doc({ fileInfo, res }: ReqContext) {
    const { data, error } = await readFileData(fileInfo.file)

    if (error || !data) {
      return respond(500, res)
    }

    const content =
      fileInfo.ext === 'markdown' || fileInfo.ext === 'md'
        ? renderMdDoc(data)
        : renderTextDoc(fileInfo.file, data)

    res.setHeader('Content-type', 'text/html')
    res.statusCode = 200
    res.end(this.renderContent(fileInfo, content))
  }

  /* logic blatently copied from ecstatic's:
   * https://github.com/jesusabdullah/node-ecstatic/blob/master/lib/ecstatic.js
   */
  async file({ res, req, fileInfo }: ReqContext) {
    const statEtag = new Etag(fileInfo.stat)

    res.setHeader('etag', statEtag.etag)
    res.setHeader('last-modified', new Date(fileInfo.stat.mtime).toUTCString())
    res.setHeader('cache-control', 'max-age=3600')

    // Return a 304 if necessary
    if (statEtag?.isNotModified(req.headers)) {
      return respond(304, res)
    }

    res.setHeader('Content-length', fileInfo.stat.size)
    res.setHeader('Content-type', this.contentTypeFromPath(fileInfo.file))

    if (req.method === 'HEAD') {
      res.statusCode = req.statusCode || 200 // overridden for 404's
      return res.end()
    }

    const stream = fs.createReadStream(fileInfo.file)

    stream.pipe(res)
    stream.on('error', (err) => {
      if (err) {
        console.error(err)
      }
      respond(500, res)
    })

    stream.on('end', function () {
      respond(200, res)
    })
  }

  // Do a MIME lookup, fall back to octet-stream and handle gzip
  // special case.
  private contentTypeFromPath(path: string) {
    // special case.
    const contentType = lookup(path)

    if (!contentType) {
      return 'application/octet-stream'
    }

    const charSet = charsets.lookup(contentType, 'utf-8')

    if (charSet) {
      return `${contentType}; charset=${charSet}`
    }

    return contentType
  }

  async search({ pathInfo, fileInfo, res }: ReqContext) {
    const q = pathInfo.qs?.get('q')

    if (!q) {
      return respond(500, res)
    }

    const content = renderSearchResults(fileInfo.rootDir, q, this.searchIndex.query(q))
    res.setHeader('Content-type', 'text/html')
    res.statusCode = 200
    res.end(this.renderContent(fileInfo, content))
  }
}

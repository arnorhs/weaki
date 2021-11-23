import http, { IncomingMessage, RequestListener } from 'http'

import { Controller } from './Controller'
import { WeakiOptions } from '../types'
import { createReqContext } from '../requestContext'
import { SearchIndex } from '../search'
import { TemplateLoader } from '../../render'

interface RequestListenerFactory {
  (opts: WeakiOptions): RequestListener
}

const requestHandler: RequestListenerFactory = (opts) => {
  const searchIndex: SearchIndex = new SearchIndex()

  searchIndex.startIndexing(opts)
  const ctrl = new Controller(searchIndex, new TemplateLoader(opts.templateRootPath))

  return async function (req, res) {
    const ctx = await createReqContext(req, opts, res)

    console.log(req.method + ': ' + ctx.fileInfo.file)

    if (ctx.pathInfo.url === 'weaki-search') {
      ctrl.search(ctx)
      return
    }

    if (opts.inlineExt.indexOf(ctx.fileInfo.ext) !== -1) {
      ctrl.doc(ctx)
      return
    }

    if (ctx.fileInfo.stat.isDirectory()) {
      ctrl.directory(ctx)
      return
    }

    ctrl.file(ctx)
  }
}

export class HttpServer {
  static start(opts: WeakiOptions) {
    http.createServer(requestHandler(opts)).listen(opts.port)
    console.log('Started server on port ' + opts.port + ' in directory ' + opts.rootDir)
  }
}

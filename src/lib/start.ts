import { HttpServer } from './http'
import { WeakiOptions } from './types'

export const start = (opts: WeakiOptions) => {
  if (!opts) {
    throw new Error('Options are not optional for starting weaki')
  }

  HttpServer.start(opts)
}

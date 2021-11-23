// Hm.. did I really roll my own http server for this project..
// TODO: remove and use something premade

import { ServerResponse } from 'http'

export type HTTPStatusCode = 200 | 304 | 400 | 403 | 404 | 405 | 500

export interface HTTPRequestHandler {
  (res: ServerResponse): void
}

const responders: Record<HTTPStatusCode, HTTPRequestHandler> = {
  // ok
  '200': (res) => {
    res.end()
  },

  // not modified
  '304': (res) => {
    res.end()
  },

  // Bad request
  '400': (res) => {
    res.end('Malformed request.')
  },

  // Access denied
  '403': (res) => {
    if (res.writable) {
      res.setHeader('content-type', 'text/plain')
      res.end('ACCESS DENIED')
    }
  },

  // not found
  '404': (res) => {
    if (res.writable) {
      res.setHeader('content-type', 'text/plain')
      res.end('404 not found')
    }
  },

  // disallowed method
  '405': (res) => {
    res.setHeader('allow', 'GET, HEAD')
    res.end()
  },

  // error
  '500': (res) => {
    res.end('Error')
  },
}

export const respond = (statusCode: HTTPStatusCode, res: ServerResponse) => {
  res.statusCode = statusCode

  if (responders[statusCode]) {
    responders[statusCode](res)
  }
}

import { parse } from 'marked'
import { ForRendering } from '../types'

export const renderMdDoc = (data: string): ForRendering => ({
  name: 'doc',
  locals: {
    content: parse(data),
  },
})

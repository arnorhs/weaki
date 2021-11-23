import path from 'path'
import { ForRendering } from '../types'

export const renderTextDoc = (file: string, data: string): ForRendering => ({
  name: 'doc',
  locals: {
    content: '<h1>' + path.basename(file) + '</h1><div class="text-document">' + data + '</div>',
  },
})

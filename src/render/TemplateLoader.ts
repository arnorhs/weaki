import path from 'path'
import fs from 'fs'
import jade from 'jade'
import { Locals, TemplateCache } from './types'

export class TemplateLoader {
  private readonly cache: TemplateCache = {}
  private readonly templateRootPath: string

  constructor(templateRootPath: string) {
    this.templateRootPath = templateRootPath
  }

  private getCompiledTemplate(name: string) {
    if (!this.cache[name]) {
      // TODO: think about this in terms of cwd - should be root dir?
      const file = path.normalize(`${this.templateRootPath}/${name}.jade`)
      const contents = fs.readFileSync(file, 'utf-8')
      this.cache[name] = jade.compile(contents, {
        filename: file,
      })
    }

    return this.cache[name]
  }

  getTemplate(name: string, locals: Locals) {
    const template = this.getCompiledTemplate(name)

    if (!template) {
      throw new Error('Template not found: ' + name)
    }

    return template(locals)
  }
}

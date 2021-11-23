export interface Locals {
  [key: string]: unknown
}

export interface ForRendering {
  name: string
  locals: Locals
}

export type TemplateCache = Record<string, (locals: Record<string, unknown>) => string>

export interface Breadcrumb {
  title: string
  url: string
}

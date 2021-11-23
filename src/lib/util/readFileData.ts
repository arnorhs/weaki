import { readFile } from 'fs/promises'

export interface FileReadData<T = String> {
  data?: T
  error?: Error | unknown
}

export const readFileData = async (path: string): Promise<FileReadData<string>> => {
  try {
    return { data: await readFile(path, 'utf-8') }
  } catch (e) {
    return { error: e }
  }
}

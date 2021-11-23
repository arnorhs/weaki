declare module 'directory-copy' {
  interface Opts {
    src: string
    dest: string
  }
  function G(opts: Opts, cb: (err: undefined | Error, results: unknown) => void): void

  export default G
}

export type postcss$comment = {
  text: string,
  source: {
    start: {
      line: number,
      column: number,
    },
    end: {
      line: number,
      column: number,
    },
  },
  error(message: string, options: { plugin: string }): void,
}

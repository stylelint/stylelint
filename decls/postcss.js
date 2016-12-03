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

export type postcss$atRule = {
  name: string,
  params: string,
  raw: Function,
  raws: {
    afterName: string,
  },
  type: string,
  parent: Object,
  nodes: Array<Object>
}

export type postcss$rule = {
  raws: Object,
  selector: string,
  type: string,
  parent: Object,
  nodes: Array<Object>,
}

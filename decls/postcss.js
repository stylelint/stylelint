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

export class postcss$node {
  name: string;
  raw: Function;
  type: string;
  parent: postcss$node;
  nodes: Array<postcss$node>;
  raws: Object
}

export class postcss$atRule extends postcss$node {
  params: string;
  raws: {
    before: string,
    after: string,
    afterName: string,
  };
}

export class postcss$rule extends postcss$node {
  selector: string;
  raws: {
    before: string,
    after: string,
  };
}

export type postcss$options = {
  from?: string,
  parser?: stylelint$syntaxes,
  syntax?: stylelint$syntaxes,
}

export type postcss$result = {
  css: string,
  root: Object,
  stylelint: {
    disabledRanges: disabledRangeObject,
    ruleSeverities?: Object,
    customMessages?: Object,
    quiet?: boolean,
  },
}

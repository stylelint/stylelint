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

declare function postcss$parser(css: ?string, opts: postcss$options): postcss$node;
declare function postcss$stringifier(postcss$node, builder: Function): void;

export type postcss$syntax = {
  stringify?: postcss$stringifier,
  parse?: postcss$parser,
}

export type postcss$options = {
  from?: string,
  to?: string,
  parser?: postcss$parser,
  stringifier?: postcss$stringifier,
  syntax?: postcss$syntax,
  map?: Object,
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

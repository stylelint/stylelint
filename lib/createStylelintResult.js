/* @flow */
"use strict";
const _ = require("lodash");

/*:: type messageType = {
  type: string,
  text: string,
  line: number,
  column: number,
  severity: string,
  rule: string,
  node: Object,
  index: number,
  stylelintType?: string,
  stylelintReference?: string,
}
*/

/*:: type postcssResultType = {
  processor: {
    version: string,
    plugins: Array<any>,
  },
  messages: Array<messageType>,
  root: {
    raws: {
      semicolon: boolean,
      after: string,
    },
    type: string,
    nodes: Array<Object>,
    source: {
      input: Object,
      start: Object,
    },
    lastEach: number,
    indexes: Object,
  },
  opts: {
    from: ?string,
    syntax: ?{
      parse: Function,
      stringify: Function,
    },
  },
  css: string,
  map: ?any,
  stylelint: {
    ruleSeverities: Object,
    customMessages: Object,
    quiet: ?any,
    disabledRanges: {
      all: Array<any>,
    },
    ignored?: boolean,
    stylelintError?: boolean,
  },
}
*/

/*:: type resultType = {
  config: {
    codeProcessors?: Array<Function>,
    ignorePatterns?: string,
    processors?: Array<any>,
    quiet?: boolean,
    resultProcessors?: Array<Function>,
    rules: Object,
  },
  filepath: string,
}
*/

module.exports = function(
  stylelint /*: stylelint$internalApi*/,
  postcssResult /*: postcssResultType*/,
  filePath /*:: ?: string*/
) /*: Promise<stylelint$result>*/ {
  const source = !postcssResult.root.source
    ? undefined
    : postcssResult.root.source.input.file ||
      postcssResult.root.source.input.id;

  // Strip out deprecation warnings from the messages
  const deprecationMessages = _.remove(postcssResult.messages, {
    stylelintType: "deprecation"
  });
  const deprecations = deprecationMessages.map((
    deprecationMessage /*: messageType*/
  ) => {
    return {
      text: deprecationMessage.text,
      reference: deprecationMessage.stylelintReference
    };
  });

  // Also strip out invalid options
  const invalidOptionMessages = _.remove(postcssResult.messages, {
    stylelintType: "invalidOption"
  });
  const invalidOptionWarnings = invalidOptionMessages.map((
    invalidOptionMessage /*: messageType*/
  ) => {
    return {
      text: invalidOptionMessage.text
    };
  });

  const parseErrors = _.remove(postcssResult.messages, {
    stylelintType: "parseError"
  });

  // This defines the stylelint result object that formatters receive
  let stylelintResult = {
    source,
    deprecations,
    invalidOptionWarnings,
    parseErrors,
    errored: postcssResult.stylelint.stylelintError,
    warnings: postcssResult.messages.map((message /*: messageType*/) => {
      return {
        line: message.line,
        column: message.column,
        rule: message.rule,
        severity: message.severity,
        text: message.text
      };
    }),
    ignored: postcssResult.stylelint.ignored,
    _postcssResult: postcssResult
  };

  return stylelint.getConfigForFile(filePath).then((
    result /*: resultType*/
  ) => {
    const config = result.config;

    if (config.resultProcessors) {
      config.resultProcessors.forEach(resultProcessor => {
        // Result processors might just mutate the result object,
        // or might return a new one
        const returned = resultProcessor(stylelintResult, source);
        if (returned) {
          stylelintResult = returned;
        }
      });
    }

    return stylelintResult;
  });
};

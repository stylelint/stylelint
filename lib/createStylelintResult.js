/* @flow */
"use strict"
const _ = require("lodash")

/*:: type InvalidOptionMessage = {
  text: string,
}*/

/*:: type DeprecationMessage = {
  text: string,
  reference: string,
} */

module.exports = function (
  stylelint/*: stylelint$internalApi*/,
  postcssResult/*: Object*/,
  filePath/*:: ?: string*/
)/*: Promise<stylelint$result>*/ {
  const source/*: any*/ = !postcssResult.root.source ? undefined : postcssResult.root.source.input.file || postcssResult.root.source.input.id

  // Strip out deprecation warnings from the messages
  const deprecationMessages/*: Array<Object>*/ = _.remove(postcssResult.messages, { stylelintType: "deprecation" })
  const deprecations/*: Array<DeprecationMessage>*/ = deprecationMessages.map(deprecationMessage => {
    return {
      text: deprecationMessage.text,
      reference: deprecationMessage.stylelintReference,
    }
  })

  // Also strip out invalid options
  const invalidOptionMessages/*: Array<Object>*/ = _.remove(postcssResult.messages, { stylelintType: "invalidOption" })
  const invalidOptionWarnings/*: Array<InvalidOptionMessage>*/ = invalidOptionMessages.map(invalidOptionMessage => {
    return {
      text: invalidOptionMessage.text,
    }
  })

  // This defines the stylelint result object that formatters receive
  let stylelintResult/*: stylelint$result*/ = {
    source,
    deprecations,
    invalidOptionWarnings,
    errored: postcssResult.stylelint.stylelintError,
    warnings: postcssResult.messages.map((message/*: Object*/) => {
      return {
        line: message.line,
        column: message.column,
        rule: message.rule,
        severity: message.severity,
        text: message.text,
      }
    }),
    ignored: postcssResult.stylelint.ignored,
    _postcssResult: postcssResult,
  }

  return stylelint.getConfigForFile(filePath).then((result/*: Object*/) => {
    const config/*: Object*/ = result.config

    if (config.resultProcessors) {
      config.resultProcessors.forEach((resultProcessor/*: Function*/)/*: ?Object*/ => {
        // Result processors might just mutate the result object,
        // or might return a new one
        const returned/*: Object*/ = resultProcessor(stylelintResult, source)
        if (returned) {
          stylelintResult = returned
        }
      })
    }

    return stylelintResult
  })
}

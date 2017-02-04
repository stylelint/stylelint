/* @flow */
"use strict"
const _ = require("lodash")

module.exports = function (
  stylelint/*: stylelint$internalApi*/,
  postcssResult/*: Object*/,
  filePath/*:: ?: string*/
)/*: Promise<stylelint$result>*/ {
  const source = !postcssResult.root.source ? undefined : postcssResult.root.source.input.file || postcssResult.root.source.input.id

  // Strip out deprecation warnings from the messages
  const deprecationMessages/*: Array<Object>*/ = _.remove(postcssResult.messages, { stylelintType: "deprecation" })
  const deprecations/*: Array<Object>*/ = deprecationMessages.map(deprecationMessage => {
    return {
      text: deprecationMessage.text,
      reference: deprecationMessage.stylelintReference,
    }
  })

  // Also strip out invalid options
  const invalidOptionMessages/*: Array<Object>*/ = _.remove(postcssResult.messages, { stylelintType: "invalidOption" })
  const invalidOptionWarnings/*: Array<Object>*/ = invalidOptionMessages.map(invalidOptionMessage => {
    return {
      text: invalidOptionMessage.text,
    }
  })

  // This defines the stylelint result object that formatters receive
  let stylelintResult/*: Object*/ = {
    source,
    deprecations,
    invalidOptionWarnings,
    errored: postcssResult.stylelint.stylelintError,
    warnings: postcssResult.messages.map(message => {
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

  return stylelint.getConfigForFile(filePath).then((result) => {
    const config/*: Object*/ = result.config

    if (config.resultProcessors) {
      config.resultProcessors.forEach(resultProcessor => {
        // Result processors might just mutate the result object,
        // or might return a new one
        const returned = resultProcessor(stylelintResult, source)
        if (returned) {
          stylelintResult = returned
        }
      })
    }

    return stylelintResult
  })
}

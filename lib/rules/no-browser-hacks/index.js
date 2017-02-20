"use strict"

const report = require("../../utils/report")
const ruleMessages = require("../../utils/ruleMessages")
const validateOptions = require("../../utils/validateOptions")
const Result = require("postcss/lib/result")
const _ = require("lodash")
const stylehacks = require("stylehacks")

const ruleName = "no-browser-hacks"

const messages = ruleMessages(ruleName, {
  rejected: (type, hack) => `Unexpected ${type} hack "${hack}"`,
})

const rule = function (on, options) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, { actual: on }, {
      optional: true,
      actual: options,
      possible: {
        browsers: [_.isString],
      },
    })
    if (!validOptions) {
      return
    }

    result.warn((
      `'${ruleName}' has been deprecated and in 8.0 will be removed. Use 'stylelint-no-browser-hacks' plugin instead.`
    ), {
      stylelintType: "deprecation",
      stylelintReference: `https://stylelint.io/user-guide/rules/${ruleName}/`,
    })

    const stylehacksOptions = { lint: true }
    if (options && options.browsers) {
      stylehacksOptions.browsers = options.browsers
    }

    const stylehacksResult = new Result()
    stylehacks(stylehacksOptions)(root, stylehacksResult)
    stylehacksResult.warnings().forEach(stylehacksWarning => {
      const message = messages.rejected(stylehacksWarning.identifier, stylehacksWarning.hack)
      report({
        ruleName,
        result,
        message,
        node: stylehacksWarning.node,
        line: stylehacksWarning.line,
        column: stylehacksWarning.column,
      })
    })
  }
}

rule.ruleName = ruleName
rule.messages = messages
module.exports = rule

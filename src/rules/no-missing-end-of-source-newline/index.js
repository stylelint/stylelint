const report = require("../../utils/report")
const ruleMessages = require("../../utils/ruleMessages")
const validateOptions = require("../../utils/validateOptions")

export const ruleName = "no-missing-end-of-source-newline"

export const messages = ruleMessages(ruleName, {
  rejected: "Unexpected missing end-of-source newline",
})

module.exports = function (actual) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, { actual })
    if (!validOptions) {
      return
    }

    const sourceCss = root.source.input.css
    if (sourceCss === "" || sourceCss.slice(-1) === "\n") {
      return
    }

    report({
      message: messages.rejected,
      node: root,
      index: sourceCss.length - 1,
      result,
      ruleName,
    })
  }
}

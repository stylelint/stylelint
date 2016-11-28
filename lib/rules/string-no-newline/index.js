"use strict"

const report = require("../../utils/report")
const ruleMessages = require("../../utils/ruleMessages")
const validateOptions = require("../../utils/validateOptions")
const styleSearch = require("style-search")

const ruleName = "string-no-newline"

const messages = ruleMessages(ruleName, {
  rejected: "Unexpected newline in string",
})

const rule = function (actual) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, { actual })
    if (!validOptions) {
      return
    }

    const cssString = root.toString()
    styleSearch({
      source: cssString,
      target: "\n",
      strings: "only",
    }, match => {
      const charBefore = cssString[match.startIndex - 1]
      let index = match.startIndex
      if (charBefore === "\\") {
        return
      }
      if (charBefore === "\r") index -= 1
      report({
        message: messages.rejected,
        node: root,
        index,
        result,
        ruleName,
      })
    })
  }
}

rule.ruleName = ruleName
rule.messages = messages
module.exports = rule

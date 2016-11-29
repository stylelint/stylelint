"use strict"

const _ = require("lodash")
const report = require("../../utils/report")
const ruleMessages = require("../../utils/ruleMessages")
const validateOptions = require("../../utils/validateOptions")
const styleSearch = require("style-search")

const ruleName = "value-list-max-empty-lines"

const messages = ruleMessages(ruleName, {
  expected: max => `Expected no more than ${max} empty line(s)`,
})

const rule = function (max) {
  const maxAdjacentNewlines = max + 1

  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: max,
      possible: _.isNumber,
    })
    if (!validOptions) {
      return
    }

    root.walkDecls(decl => {
      const value = decl.value
      const repeatLFNewLines = _.repeat("\n", maxAdjacentNewlines)
      const repeatCRLFNewLines = _.repeat("\r\n", maxAdjacentNewlines)

      styleSearch({ source: value, target: "\n" }, match => {
        if (value.substr(match.startIndex + 1, maxAdjacentNewlines) === repeatLFNewLines || value.substr(match.startIndex + 1, maxAdjacentNewlines * 2) === repeatCRLFNewLines) {
          // Put index at `\r` if it's CRLF, otherwise leave it at `\n`
          let index = match.startIndex
          if (value[index - 1] === "\r") {
            index -= 1
          }

          report({
            message: messages.expected(max),
            node: decl,
            index,
            result,
            ruleName,
          })
        }
      })
    })
  }
}

rule.ruleName = ruleName
rule.messages = messages
module.exports = rule

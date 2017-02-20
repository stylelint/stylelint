"use strict"

const _ = require("lodash")
const report = require("../../utils/report")
const ruleMessages = require("../../utils/ruleMessages")
const validateOptions = require("../../utils/validateOptions")
const styleSearch = require("style-search")

const ruleName = "max-empty-lines"

const messages = ruleMessages(ruleName, {
  expected: max => `Expected no more than ${max} empty line(s)`,
})

const rule = function (max) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: max,
      possible: _.isNumber,
    })
    if (!validOptions) {
      return
    }
    
    // `//`-comments are need to be processed by postcss-scss
    // To do that we have to use .toString()
    const rootString = root.toString()
    const separator = /\r\n/.test(rootString) ? "\r\n" : "\n"
    const lines = rootString.split(separator)
    
    var index = 0
    for (var i = 0; i < lines.length - max; i++) {
      index += (lines[i] + separator).length
      
      if (lines[i] == "") {
        if (lines.slice(i + 1, i + 1 + max).join("") == "") {
          report({
            message: messages.expected(max),
            node: root,
            index: index + (separator.length * (max - 1)),
            result,
            ruleName,
          });
        }
      }
    }
  }
}

rule.ruleName = ruleName
rule.messages = messages
module.exports = rule

"use strict"

const blurFunctionArguments = require("../../utils/blurFunctionArguments")
const report = require("../../utils/report")
const ruleMessages = require("../../utils/ruleMessages")
const styleSearch = require("style-search")
const validateOptions = require("../../utils/validateOptions")

const ruleName = "color-hex-case"

const messages = ruleMessages(ruleName, {
  expected: (actual, expected) => `Expected "${actual}" to be "${expected}"`,
})

const suggestFix = function (line, column, hexValue, expectedHex) {
  return {
    insertion: expectedHex,
    range: {
      begin: {
        line,
        column
      },
      end: {
        line,
        column: column + hexValue.length
      }
    },
    type: "text-swap",
  }
}

const rule = function (expectation) {
  return (root, result, options) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: expectation,
      possible: [
        "lower",
        "upper",
      ],
    })
    if (!validOptions) {
      return
    }

    root.walkDecls(decl => {
      const declString = blurFunctionArguments(decl.toString(), "url")
      styleSearch({ source: declString, target: "#" }, match => {
        const hexMatch = /^#[0-9A-Za-z]+/.exec(declString.substr(match.startIndex))
        if (!hexMatch) {
          return
        }

        const hexValue = hexMatch[0]
        const hexValueLower = hexValue.toLowerCase()
        const hexValueUpper = hexValue.toUpperCase()
        const expectedHex = expectation === "lower"
          ? hexValueLower
          : hexValueUpper

        if (hexValue === expectedHex) {
          return
        }

        const column = decl.source.start.column + match.startIndex

        report({
          message: messages.expected(hexValue, expectedHex),
          node: decl,
          index: match.startIndex,
          result,
          ruleName,
          suggestedFix: options.suggestFixes && suggestFix(decl.source.start.line, column, hexValue, expectedHex),
        })
      })
    })
  }
}

rule.ruleName = ruleName
rule.messages = messages
module.exports = rule

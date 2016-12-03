"use strict"

const report = require("../../utils/report")
const ruleMessages = require("../../utils/ruleMessages")
const validateOptions = require("../../utils/validateOptions")
const styleSearch = require("style-search")

const ruleName = "color-hex-length"

const messages = ruleMessages(ruleName, {
  expected: (actual, expected) => `Expected "${actual}" to be "${expected}"`,
})

const rule = function (expectation) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: expectation,
      possible: [
        "short",
        "long",
      ],
    })
    if (!validOptions) {
      return
    }

    root.walkDecls(decl => {
      const declString = decl.toString()

      styleSearch({ source: declString, target: "#" }, match => {
        const hexMatch = /^#[0-9A-Za-z]+/.exec(declString.substr(match.startIndex))
        if (!hexMatch) {
          return
        }

        const hexValue = hexMatch[0]

        if (
          expectation === "long"
          && hexValue.length !== 4
          && hexValue.length !== 5
        ) {
          return
        }

        if (
          expectation === "short"
          && (
            hexValue.length < 6
            || !canShrink(hexValue)
          )
        ) {
          return
        }

        const variant = expectation === "long"
          ? longer
          : shorter

        report({
          message: messages.expected(hexValue, variant(hexValue)),
          node: decl,
          index: match.startIndex,
          result,
          ruleName,
        })
      })
    })
  }
}

function canShrink(hex) {
  hex = hex.toLowerCase()

  return hex[1] === hex[2]
    && hex[3] === hex[4]
    && hex[5] === hex[6]
    && (hex.length === 7
      || hex.length === 9
      && hex[7] === hex[8]
    )
}

function shorter(hex) {
  let hexVariant = "#"
  for (let i = 1; i < hex.length; i = i + 2) {
    hexVariant += hex[i]
  }
  return hexVariant
}

function longer(hex) {
  let hexVariant = "#"
  for (let i = 1; i < hex.length; i++) {
    hexVariant += hex[i] + hex[i]
  }
  return hexVariant
}

rule.ruleName = ruleName
rule.messages = messages
module.exports = rule

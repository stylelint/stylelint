const declarationValueIndex = require("../../utils/declarationValueIndex")
const isStandardSyntaxFunction = require("../../utils/isStandardSyntaxFunction")
const matchesStringOrRegExp = require("../../utils/matchesStringOrRegExp")
const report = require("../../utils/report")
const ruleMessages = require("../../utils/ruleMessages")
const validateOptions = require("../../utils/validateOptions")
import { isString } from "lodash"
const valueParser = require("postcss-value-parser")
import { vendor } from "postcss"

export const ruleName = "function-blacklist"

export const messages = ruleMessages(ruleName, {
  rejected: name => `Unexpected function "${name}"`,
})

function rule(blacklist) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: blacklist,
      possible: [isString],
    })
    if (!validOptions) {
      return
    }
    root.walkDecls(decl => {
      const value = decl.value

      valueParser(value).walk(function (node) {
        if (node.type !== "function") {
          return
        }
        if (!isStandardSyntaxFunction(node)) {
          return
        }
        if (!matchesStringOrRegExp(vendor.unprefixed(node.value).toLowerCase(), blacklist)) {
          return
        }

        report({
          message: messages.rejected(node.value),
          node: decl,
          index: declarationValueIndex(decl) + node.sourceIndex,
          result,
          ruleName,
        })
      })
    })
  }
}

rule.primaryOptionArray = true

module.exports = rule

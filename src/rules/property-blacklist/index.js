const isCustomProperty = require("../../utils/isCustomProperty")
const isStandardSyntaxProperty = require("../../utils/isStandardSyntaxProperty")
const matchesStringOrRegExp = require("../../utils/matchesStringOrRegExp")
const report = require("../../utils/report")
const ruleMessages = require("../../utils/ruleMessages")
const validateOptions = require("../../utils/validateOptions")
const _ = require("lodash")
import { vendor } from "postcss"

export const ruleName = "property-blacklist"

export const messages = ruleMessages(ruleName, {
  rejected: property => `Unexpected property "${property}"`,
})

function rule(blacklist) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: blacklist,
      possible: [_.isString],
    })
    if (!validOptions) {
      return
    }

    root.walkDecls(decl => {
      const prop = decl.prop

      if (!isStandardSyntaxProperty(prop)) {
        return
      }
      if (isCustomProperty(prop)) {
        return
      }
      if (!matchesStringOrRegExp(vendor.unprefixed(prop), blacklist)) {
        return
      }

      report({
        message: messages.rejected(prop),
        node: decl,
        result,
        ruleName,
      })
    })
  }
}

rule.primaryOptionArray = true

module.exports = rule

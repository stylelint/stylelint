"use strict"

const declarationValueIndex = require("../../utils/declarationValueIndex")
const getUnitFromValueNode = require("../../utils/getUnitFromValueNode")
const matchesStringOrRegExp = require("../../utils/matchesStringOrRegExp")
const report = require("../../utils/report")
const ruleMessages = require("../../utils/ruleMessages")
const validateOptions = require("../../utils/validateOptions")
const _ = require("lodash")
const valueParser = require("postcss-value-parser")
const postcss = require("postcss")

const ruleName = "declaration-property-unit-blacklist"

const messages = ruleMessages(ruleName, {
  rejected: (property, unit) => `Unexpected unit "${unit}" for property "${property}"`,
})

const rule = function (blacklist) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: blacklist,
      possible: [_.isObject],
    })
    if (!validOptions) {
      return
    }

    root.walkDecls(decl => {
      const prop = decl.prop,
        value = decl.value

      const unprefixedProp = postcss.vendor.unprefixed(prop)

      const propBlacklist = _.find(blacklist, (list, propIdentifier) => matchesStringOrRegExp(unprefixedProp, propIdentifier))

      if (!propBlacklist) {
        return
      }

      valueParser(value).walk(function (node) {
        // Ignore wrong units within `url` function
        if (
          node.type === "function"
          && node.value.toLowerCase() === "url"
        ) {
          return false
        }
        if (node.type === "string") {
          return
        }

        const unit = getUnitFromValueNode(node)

        if (
          !unit
          || unit
          && propBlacklist.indexOf(unit.toLowerCase()) === -1
        ) {
          return
        }

        report({
          message: messages.rejected(prop, unit),
          node: decl,
          index: declarationValueIndex(decl) + node.sourceIndex,
          result,
          ruleName,
        })
      })
    })
  }
}

rule.ruleName = ruleName
rule.messages = messages
module.exports = rule

"use strict"

const hasBlock = require("../../utils/hasBlock")
const optionsMatches = require("../../utils/optionsMatches")
const report = require("../../utils/report")
const ruleMessages = require("../../utils/ruleMessages")
const validateOptions = require("../../utils/validateOptions")
const _ = require("lodash")

const ruleName = "max-nesting-depth"

const messages = ruleMessages(ruleName, {
  expected: depth => `Expected nesting depth to be no more than ${depth}`,
})

const rule = function (max, options) {
  const ignoreAtRulesWithoutDeclarationBlocks = optionsMatches(options, "ignore", "at-rules-without-declaration-blocks") || optionsMatches(options, "ignore", "blockless-at-rules")
  const isIgnoreAtRule = node => node.type === "atrule" && optionsMatches(options, "ignoreAtRules", node.name)

  return (root, result) => {
    validateOptions(result, ruleName, {
      actual: max,
      possible: [_.isNumber],
    }, {
      optional: true,
      actual: options,
      possible: {
        ignore: [
          "at-rules-without-declaration-blocks",
          "blockless-at-rules",
        ],
        ignoreAtRules: [_.isString],
      },
    })

    if (optionsMatches(options, "ignore", "at-rules-without-declaration-blocks")) {
      result.warn((
        "'max-nesting-depth\'s' \"at-rules-without-declaration-blocks\" option has been deprecated and in 8.0 will be removed. Instead use the \"blockless-at-rules\" option."
      ), {
        stylelintType: "deprecation",
        stylelintReference: "https://stylelint.io/user-guide/rules/max-nesting-depth/",
      })
    }

    root.walkRules(checkStatement)
    root.walkAtRules(checkStatement)

    function checkStatement(statement) {
      if (isIgnoreAtRule(statement)) {
        return
      }
      if (!hasBlock(statement)) {
        return
      }
      const depth = nestingDepth(statement)
      if (depth > max) {
        report({
          ruleName,
          result,
          node: statement,
          message: messages.expected(max),
        })
      }
    }
  }

  function nestingDepth(node, level) {
    level = level || 0
    const parent = node.parent

    if (isIgnoreAtRule(parent)) {
      return 0
    }

    // The nesting depth level's computation has finished
    // when this function, recursively called, receives
    // a node that is not nested -- a direct child of the
    // root node
    if (parent.type === "root" || parent.type === "atrule" && parent.parent.type === "root") {
      return level
    }

    if (ignoreAtRulesWithoutDeclarationBlocks && node.type === "atrule" && node.every(child => child.type !== "decl")) {
      return nestingDepth(parent, level)
    }

    // Unless any of the conditions above apply, we want to
    // add 1 to the nesting depth level and then check the parent,
    // continuing to add and move up the hierarchy
    // until we hit the root node
    return nestingDepth(parent, level + 1)
  }
}

rule.ruleName = ruleName
rule.messages = messages
module.exports = rule

"use strict"

const _ = require("lodash")
const isKeyframeSelector = require("../../utils/isKeyframeSelector")
const isStandardSyntaxRule = require("../../utils/isStandardSyntaxRule")
const isStandardSyntaxSelector = require("../../utils/isStandardSyntaxSelector")
const isStandardSyntaxTypeSelector = require("../../utils/isStandardSyntaxTypeSelector")
const isOnlyWhitespace = require("../../utils/isOnlyWhitespace")
const optionsMatches = require("../../utils/optionsMatches")
const parseSelector = require("../../utils/parseSelector")
const report = require("../../utils/report")
const ruleMessages = require("../../utils/ruleMessages")
const validateOptions = require("../../utils/validateOptions")
const resolveNestedSelector = require("postcss-resolve-nested-selector")

const ruleName = "selector-no-type"

const messages = ruleMessages(ruleName, {
  rejected: "Unexpected type selector",
})

const rule = function (on, options) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, { actual: on }, {
      actual: options,
      possible: {
        ignore: [
          "descendant",
          "compounded",
          "child",
        ],
        ignoreTypes: [_.isString],
      },
      optional: true,
    })
    if (!validOptions) {
      return
    }

    const ignoreDescendant = optionsMatches(options, "ignore", "descendant")
    const ignoreCompounded = optionsMatches(options, "ignore", "compounded")
    const ignoreChild = optionsMatches(options, "ignore", "child")

    root.walkRules(rule => {
      const selector = rule.selector,
        selectors = rule.selectors

      if (!isStandardSyntaxRule(rule)) {
        return
      }
      if (!isStandardSyntaxSelector(selector)) {
        return
      }
      if (selectors.some(s => isKeyframeSelector(s))) {
        return
      }

      if (ignoreDescendant) {
        // Resolve each selector within the list before checking
        selectors.forEach(selector => {
          resolveNestedSelector(selector, rule).forEach(selector => {
            checkSelector(selector, rule)
          })
        })
      } else {
        checkSelector(selector, rule)
      }
    })

    function checkSelector(selector, rule) {
      parseSelector(selector, result, rule, selectorAST => {
        selectorAST.walkTags(tag => {
          if (!isStandardSyntaxTypeSelector(tag)) {
            return
          }

          if (optionsMatches(options, "ignoreTypes", tag.value)) {
            return
          }

          if (ignoreDescendant && hasDescendantCombinatorBefore(tag)) {
            return
          }

          if (ignoreCompounded && hasCompoundSelector(tag)) {
            return
          }

          if (ignoreChild && hasChildCombinator(tag)) {
            return
          }

          report({
            message: messages.rejected,
            node: rule,
            index: tag.sourceIndex,
            ruleName,
            result,
          })
        })
      })
    }
  }
}

function hasDescendantCombinatorBefore(node) {
  const nodeIndex = node.parent.nodes.indexOf(node)
  return node.parent.nodes.slice(0, nodeIndex).some(isDescendantCombinator)
}

function hasChildCombinator(node) {
  if (node.prev() && isChildCombinator(node.prev())) {
    return true
  }

  if (node.next() && isChildCombinator(node.next())) {
    return true
  }
  return false
}

function hasCompoundSelector(node) {
  if (node.prev() && !isCombinator(node.prev())) {
    return true
  }
  if (node.next() && !isCombinator(node.next())) {
    return true
  }
  return false
}

function isCombinator(node) {
  if (!node) return false
  return _.get(node, "type") === "combinator"
}

function isDescendantCombinator(node) {
  if (!node) return false
  return isCombinator(node) && isOnlyWhitespace(node.value)
}

function isChildCombinator(node) {
  if (!node) return false
  return isCombinator(node) && node.value.includes(">")
}

rule.ruleName = ruleName
rule.messages = messages
module.exports = rule

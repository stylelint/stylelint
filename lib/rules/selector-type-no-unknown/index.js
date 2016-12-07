"use strict"

const isKeyframeSelector = require("../../utils/isKeyframeSelector")
const isStandardSyntaxRule = require("../../utils/isStandardSyntaxRule")
const isStandardSyntaxSelector = require("../../utils/isStandardSyntaxSelector")
const isStandardSyntaxTypeSelector = require("../../utils/isStandardSyntaxTypeSelector")
const optionsMatches = require("../../utils/optionsMatches")
const parseSelector = require("../../utils/parseSelector")
const report = require("../../utils/report")
const ruleMessages = require("../../utils/ruleMessages")
const validateOptions = require("../../utils/validateOptions")
const htmlTags = require("html-tags")
const _ = require("lodash")
const svgTags = require("svg-tags")

const ruleName = "selector-type-no-unknown"

const messages = ruleMessages(ruleName, {
  rejected: selector => `Unexpected unknown type selector "${selector}"`,
})

// htmlTags includes only "standard" tags. So we augment it with older tags etc.
const nonStandardHtmlTags = new Set([
  "acronym",
  "applet",
  "basefont",
  "big",
  "blink",
  "center",
  "content",
  "dir",
  "font",
  "frame",
  "frameset",
  "hgroup",
  "isindex",
  "keygen",
  "listing",
  "marquee",
  "noembed",
  "plaintext",
  "spacer",
  "strike",
  "tt",
  "xmp",
])

const rule = function (actual, options) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, { actual }, {
      actual: options,
      possible: {
        ignoreTypes: [_.isString],
      },
      optional: true,
    })
    if (!validOptions) {
      return
    }

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

      parseSelector(selector, result, rule, selectorTree => {
        selectorTree.walkTags(tagNode => {
          if (!isStandardSyntaxTypeSelector(tagNode)) {
            return
          }

          if (optionsMatches(options, "ignoreTypes", tagNode.value)) {
            return
          }

          const tagName = tagNode.value
          const tagNameLowerCase = tagName.toLowerCase()

          if (htmlTags.indexOf(tagNameLowerCase) !== -1 || svgTags.indexOf(tagNameLowerCase) !== -1 || nonStandardHtmlTags.has(tagNameLowerCase)) {
            return
          }

          report({
            message: messages.rejected(tagName),
            node: rule,
            index: tagNode.sourceIndex,
            ruleName,
            result,
          })
        })
      })
    })
  }
}

rule.ruleName = ruleName
rule.messages = messages
module.exports = rule

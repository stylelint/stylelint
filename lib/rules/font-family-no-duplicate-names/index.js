"use strict"

const declarationValueIndex = require("../../utils/declarationValueIndex")
const findFontFamily = require("../../utils/findFontFamily")
const report = require("../../utils/report")
const ruleMessages = require("../../utils/ruleMessages")
const validateOptions = require("../../utils/validateOptions")
const keywordSets = require("../../reference/keywordSets")

const ruleName = "font-family-no-duplicate-names"

const messages = ruleMessages(ruleName, {
  rejected: name => `Unexpected duplicate name ${name}`,
})

const isFamilyNameKeyword = node => !node.quote && keywordSets.fontFamilyKeywords.has(node.value.toLowerCase())

const rule = function (actual) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, { actual })
    if (!validOptions) {
      return
    }

    root.walkDecls(/^font(-family)?$/i, decl => {
      const keywords = new Set()
      const familyNames = new Set()

      const fontFamilies = findFontFamily(decl.value)

      if (fontFamilies.length === 0) {
        return
      }

      fontFamilies.forEach(fontFamilyNode => {
        if (isFamilyNameKeyword(fontFamilyNode)) {
          const family = fontFamilyNode.value.toLowerCase()

          if (keywords.has(family)) {
            complain(messages.rejected(family), declarationValueIndex(decl) + fontFamilyNode.sourceIndex, decl)
            return
          }

          keywords.add(family)
          return
        }

        const family = fontFamilyNode.value.trim()

        if (familyNames.has(family)) {
          complain(messages.rejected(family), declarationValueIndex(decl) + fontFamilyNode.sourceIndex, decl)
          return
        }

        familyNames.add(family)
      })
    })

    function complain(message, index, decl) {
      report({
        result,
        ruleName,
        message,
        node: decl,
        index,
      })
    }
  }
}

rule.ruleName = ruleName
rule.messages = messages
module.exports = rule

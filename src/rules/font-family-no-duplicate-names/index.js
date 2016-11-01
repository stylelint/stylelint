import {
  declarationValueIndex,
  findFontFamily,
  report,
  ruleMessages,
  validateOptions,
  } from "../../utils"
import { fontFamilyKeywords } from "../../reference/keywordSets"

export const ruleName = "font-family-no-duplicate-names"

export const messages = ruleMessages(ruleName, {
  rejected: (name) => `Unexpected duplicate name ${name}`,
})

const isFamilyNameKeyword = (node) => !node.quote && fontFamilyKeywords.has(node.value.toLowerCase())

export default function (actual) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, { actual })
    if (!validOptions) { return }

    root.walkDecls(/^font(-family)?$/i, decl => {
      const keywords = new Set()
      const familyNames = new Set()

      const fontFamilies = findFontFamily(decl.value)

      if (fontFamilies.length === 0) { return }

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


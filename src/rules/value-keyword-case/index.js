import { animationNameKeywords, animationShorthandKeywords, camelCaseKeywords, fontFamilyKeywords, fontShorthandKeywords, gridAreaKeywords, gridColumnKeywords, gridRowKeywords, listStyleShorthandKeywords, listStyleTypeKeywords, systemColors } from "../../reference/keywordSets"
const declarationValueIndex = require("../../utils/declarationValueIndex")
const getUnitFromValueNode = require("../../utils/getUnitFromValueNode")
const isCounterIncrementCustomIdentValue = require("../../utils/isCounterIncrementCustomIdentValue")
const isStandardSyntaxValue = require("../../utils/isStandardSyntaxValue")
const matchesStringOrRegExp = require("../../utils/matchesStringOrRegExp")
const report = require("../../utils/report")
const ruleMessages = require("../../utils/ruleMessages")
const validateOptions = require("../../utils/validateOptions")
const _ = require("lodash")
const valueParser = require("postcss-value-parser")

export const ruleName = "value-keyword-case"

export const messages = ruleMessages(ruleName, {
  expected: (actual, expected) => `Expected "${actual}" to be "${expected}"`,
})

// Operators are interpreted as "words" by the value parser, so we want to make sure to ignore them.
const ignoredCharacters = new Set([ "+", "-", "/", "*", "%" ])

const mapLowercaseKeywordsToCamelCase = new Map()
camelCaseKeywords.forEach(func => {
  mapLowercaseKeywordsToCamelCase.set(func.toLowerCase(), func)
})

module.exports = function (expectation, options) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: expectation,
      possible: [ "lower", "upper" ],
    }, {
      actual: options,
      possible: {
        ignoreKeywords: [_.isString],
      },
      optional: true,
    })
    if (!validOptions) {
      return
    }

    root.walkDecls(decl => {
      const prop = decl.prop,
        value = decl.value

      valueParser(value).walk(node => {
        const valueLowerCase = node.value.toLowerCase()

        // Ignore system colors
        if (systemColors.has(valueLowerCase)) {
          return
        }

        // Ignore keywords within `url` and `var` function
        if (node.type === "function" && (valueLowerCase === "url" || valueLowerCase === "var")) {
          return false
        }

        const keyword = node.value

        // Ignore css variables, and hex values, and math operators, and sass interpolation
        if (node.type !== "word" || !isStandardSyntaxValue(node.value) || value.indexOf("#") !== -1 || ignoredCharacters.has(keyword) || getUnitFromValueNode(node)) {
          return
        }

        if (prop === "animation" && !animationShorthandKeywords.has(valueLowerCase) && !animationNameKeywords.has(valueLowerCase)) {
          return
        }
        if (prop === "animation-name" && !animationNameKeywords.has(valueLowerCase)) {
          return
        }
        if (prop === "font" && !fontShorthandKeywords.has(valueLowerCase) && !fontFamilyKeywords.has(valueLowerCase)) {
          return
        }
        if (prop === "font-family" && !fontFamilyKeywords.has(valueLowerCase)) {
          return
        }
        if (prop === "counter-increment" && isCounterIncrementCustomIdentValue(valueLowerCase)) {
          return
        }
        if (prop === "grid-row" && !gridRowKeywords.has(valueLowerCase)) {
          return
        }
        if (prop === "grid-column" && !gridColumnKeywords.has(valueLowerCase)) {
          return
        }
        if (prop === "grid-area" && !gridAreaKeywords.has(valueLowerCase)) {
          return
        }
        if (prop === "list-style" && !listStyleShorthandKeywords.has(valueLowerCase) && !listStyleTypeKeywords.has(valueLowerCase)) {
          return
        }
        if (prop === "list-style-type" && !listStyleTypeKeywords.has(valueLowerCase)) {
          return
        }

        const ignoreKeywords = options && options.ignoreKeywords || []

        if (ignoreKeywords.length > 0 && matchesStringOrRegExp(keyword, ignoreKeywords)) {
          return
        }

        const keywordLowerCase = keyword.toLocaleLowerCase()
        let expectedKeyword = null

        if (expectation === "lower" && mapLowercaseKeywordsToCamelCase.has(keywordLowerCase)) {
          expectedKeyword = mapLowercaseKeywordsToCamelCase.get(keywordLowerCase)
        } else if (expectation === "lower") {
          expectedKeyword = keyword.toLowerCase()
        } else {
          expectedKeyword = keyword.toUpperCase()
        }

        if (keyword === expectedKeyword) {
          return
        }

        report({
          message: messages.expected(keyword, expectedKeyword),
          node: decl,
          index: declarationValueIndex(decl) + node.sourceIndex,
          result,
          ruleName,
        })
      })
    })
  }
}

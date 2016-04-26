import valueParser from "postcss-value-parser"
import { isString } from "lodash"
import {
  declarationValueIndex,
  findAnimationName,
  findFontFamily,
  isStandardValue,
  matchesStringOrRegExp,
  report,
  ruleMessages,
  validateOptions,
} from "../../utils"

export const ruleName = "value-keyword-case"

export const messages = ruleMessages(ruleName, {
  expected: (actual, expected) => `Expected "${actual}" to be "${expected}"`,
})

// Operators are interpreted as "words" by the value parser, so we want to make sure to ignore them.
const ignoredCharacters = new Set([
  "+", "-", "/", "*", "%",
])

const ignoredProperties = new Set([
  "animation-timing-function",
  "animation-name",
  "will-change",
  "font-family",
  "counter-increment",
  "grid-row",
  "grid-column",
  "grid-area",
  "list-style-type",
])

const allowedValueForIgnoreProperties = new Set([
  "none", "inherit", "initial", "unset",
])

const ignoredCamelCaseKeywords = {
  "optimizespeed": "optimizeSpeed",
  "optimizelegibility": "optimizeLegibility",
  "geometricprecision": "geometricPrecision",
  "currentcolor": "currentColor",
}

export default function (expectation, options) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: expectation,
      possible: [
        "lower",
        "upper",
      ],
    }, {
      actual: options,
      possible: {
        ignoreKeywords: [isString],
      },
      optional: true,
    })
    if (!validOptions) { return }

    root.walkDecls(decl => {
      const { prop, value } = decl

      if (ignoredProperties.has(prop) && !allowedValueForIgnoreProperties.has(value)) { return }

      valueParser(value).walk((node) => {
        // Ignore keywords within `url` and `var` function
        if (
          node.type === "function" && (
            node.value === "url" ||
            node.value === "var"
          )
        ) { return false }

        const keyword = node.value

        // Ignore css variables, and hex values, and math operators, and sass interpolation
        if (node.type !== "word"
          || !isStandardValue(node.value)
          || value.indexOf("#") !== -1
          || ignoredCharacters.has(keyword)
        ) { return }

        if (decl.prop === "animation") {
          const animationNames = findAnimationName(node.value.toLowerCase())

          if (animationNames.length > 0) { return }
        }

        if (decl.prop === "font") {
          const fontFamilies = findFontFamily(node.value.toLowerCase())

          if (fontFamilies.length > 0) { return }
        }

        const parsedUnit = valueParser.unit(keyword)

        if (parsedUnit !== false) { return }

        const ignoreKeywords = options && options.ignoreKeywords || []

        if (ignoreKeywords.length > 0 && matchesStringOrRegExp(keyword, ignoreKeywords)) { return }

        const keywordLowerCase = keyword.toLocaleLowerCase()
        let expectedKeyword = null

        if (expectation === "lower"
          && ignoredCamelCaseKeywords.hasOwnProperty(keywordLowerCase)
        ) {
          expectedKeyword = ignoredCamelCaseKeywords[keywordLowerCase]
        } else if (expectation === "lower") {
          expectedKeyword = keyword.toLowerCase()
        } else {
          expectedKeyword = keyword.toUpperCase()
        }

        if (keyword === expectedKeyword) { return }

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

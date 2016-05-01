import valueParser from "postcss-value-parser"
import { isString } from "lodash"
import {
  declarationValueIndex,
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
      const { value } = decl

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

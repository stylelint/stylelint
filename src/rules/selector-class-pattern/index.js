import resolveNestedSelector from "postcss-resolve-nested-selector"
import selectorParser from "postcss-selector-parser"
import { isRegExp, isString, isBoolean, isFunction, isEqual, omit, omitBy } from "lodash"
import {
  cssRuleHasSelectorEndingWithColon,
  report,
  ruleMessages,
  validateOptions,
} from "../../utils"

export const ruleName = "selector-class-pattern"

export const messages = ruleMessages(ruleName, {
  expected: selectorValue => `Expected class selector ".${selectorValue}" to match specified pattern`,
})

export default function (pattern, options) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: pattern,
      possible: [ isRegExp, isString ],
    }, {
      actual: options,
      possible: {
        resolveNestedSelectors: isBoolean,
      },
      optional: true,
    })
    if (!validOptions) { return }

    // In context of a nested selector, some combinations
    // are tested mutliple times, to avoid triggering multiple
    // identical errors, we will use an internal list of checked rules
    var checked = []

    const normalizedPattern = isString(pattern) ? new RegExp(pattern) : pattern

    root.walkRules(rule => {
      if (cssRuleHasSelectorEndingWithColon(rule)) { return }

      if (options && options.resolveNestedSelectors) {
        resolveNestedSelector(rule.selector, rule).forEach(selector => {
          selectorParser(checkSelector).process(selector)
        })
      } else {
        selectorParser(checkSelector).process(rule.selector)
      }

      function checkSelector(fullSelector) {
        fullSelector.eachInside(selectorNode => {
          if (selectorNode.type !== "class") { return }

          // we take the "selectorNode" and remove all functions from it
          // and remove the "parent" key, by doing this we make the selectors
          // comparable to one another, if the refer to the same selector in the source.
          var compareableSelector = omitBy(omit(selectorNode, ["parent"]), isFunction)
          if (alreadyChecked(compareableSelector)) { return }
          checked.push(compareableSelector)

          const { value, sourceIndex } = selectorNode

          if (!normalizedPattern.test(value)) {
            report({
              result,
              ruleName,
              message: messages.expected(value),
              node: rule,
              index: sourceIndex,
            })
          }
        })
      }
    })

    function alreadyChecked(selector) {
      var i = checked.length
      while (i--) {
        if (isEqual(checked[i], selector)) {
          return true
        }
      }
      return false
    }
  }
}

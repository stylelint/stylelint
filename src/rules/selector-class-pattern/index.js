import resolveNestedSelector from "postcss-resolve-nested-selector"
import selectorParser from "postcss-selector-parser"
import _ from "lodash"
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
      possible: [ _.isRegExp, _.isString ],
    }, {
      actual: options,
      possible: {
        resolveNestedSelectors: _.isBoolean,
      },
      optional: true,
    })
    if (!validOptions) { return }

    const shouldResolveNestedSelectors = _.get(options, "resolveNestedSelectors")
    const normalizedPattern = (_.isString(pattern))
      ? new RegExp(pattern)
      : pattern

    root.walkRules(rule => {
      if (cssRuleHasSelectorEndingWithColon(rule)) { return }

      // Ignore Sass intepolation possibilities
      if (/#{.+}/.test(rule.selector)) { return }

      // Only bother resolving selectors that have an interpolating &
      if (shouldResolveNestedSelectors && hasInterpolatingAmpersand(rule.selector)) {
        resolveNestedSelector(rule.selector, rule).forEach(selector => {
          selectorParser(s => checkSelector(s, rule)).process(selector)
        })
      } else {
        selectorParser(s => checkSelector(s, rule)).process(rule.selector)
      }
    })

    function checkSelector(fullSelector, rule) {
      fullSelector.eachClass(classNode => {
        const { value, sourceIndex } = classNode
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
  }
}

// An "interpolating ampersand" means an "&" used to interpolate
// within another simple selector, rather than an "&" that
// stands on its own as a simple selector
function hasInterpolatingAmpersand(selector) {
  for (let i = 0, l = selector.length; i < l; i++) {
    if (selector[i] !== "&") { continue }
    if (!_.isUndefined(selector[i - 1]) && !isCombinator(selector[i - 1])) { return true }
    if (!_.isUndefined(selector[i + 1]) && !isCombinator(selector[i + 1])) { return true }
  }
  return false
}

function isCombinator(x) {
  return /[\s+>~]/.test(x)
}

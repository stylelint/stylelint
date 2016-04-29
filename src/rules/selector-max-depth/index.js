import resolvedNestedSelector from "postcss-resolve-nested-selector"

import {
  isStandardRule,
  isStandardSelector,
  report,
  ruleMessages,
  validateOptions,
} from "../../utils"

export const ruleName = "selector-max-depth"

export const messages = ruleMessages(ruleName, {
  expected: (selector, depth) => `Expected "${selector}" to have a depth equal to or less than ${depth}`,
})

export default function (max) {
  return (root, result) => {
    const innerSelectorReg = /(?::not\((.*?)\))/g
    const validOptions = validateOptions(result, ruleName, {
      actual: max,
      possible: [function (max) {
        return typeof max === "number" && max > 0
      }],
    })
    if (!validOptions) { return }

    // Compares depth of a selector with the maximum
    function checkDepth(selector, rule) {
      // a) Replacing all :not() occureces with a dummy selector
      const stripped = selector.replace(innerSelectorReg, "a")
        // b) Replacing "[...]", "(...)", "+", "~" (the last two might come with
        // spaces) with dummy selectors for simplicity and since we don't need those to count depth
        .replace(/\(.*?\)|\[.*?\]|(\s*)[+~](\s*)/g, "a")
        // c) Trimming redundant spaces
        .replace(/\s+/g, " ")

      // Finally find everything between spaces and ">" (possibly with spaces)
      const depth = stripped.match(/[^\s>]+/g).length
      if (depth > max) {
        report({
          ruleName,
          result,
          node: rule,
          message: messages.expected(selector, max),
          word: selector,
        })
      }
    }

    root.walkRules(rule => {
      // Nested selectors are processed in steps, as nesting levels are resolved.
      // Here we skip processing the intermediate patrs of selectors
      if (rule.nodes.some(node => node.type === "rule" || node.type === "atrule")) { return }
      // Skip custom rules, Less selectors, etc.
      if (!isStandardRule(rule)) { return }
      // Skip selectors with interpolation
      if (!isStandardSelector(rule.selector)) { return }

      // Using rule.selectors gets us each selector if there is a comma separated set
      rule.selectors.forEach((selector) => {
        resolvedNestedSelector(selector, rule).forEach(resolvedSelector => {
          // Initializing a new object, so that innerSelectorReg's lastIndex
          // dropping in checkDepth doesn't affect a loop here
          const innerSelReplaceReg = new RegExp(innerSelectorReg)
          // 1. Find all :not() pseudo-classes, check their contents first
          let match = innerSelReplaceReg.exec(resolvedSelector)
          while (match !== null) {
            checkDepth(match[1], rule)
            match = innerSelReplaceReg.exec(resolvedSelector)
          }
          // 2. Check the rest
          checkDepth(resolvedSelector, rule)
        })
      })
    })
  }
}

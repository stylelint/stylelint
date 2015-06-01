import {
  ruleMessages,
  styleSearch
} from "../../utils"

export const ruleName = "selector-psuedo-element-colon-notation"

export const messages = ruleMessages(ruleName, {
  expected: (q) => `Expected ${q} colon pseudo-element notation`,
})

/**
 * @param {"single"|"double"} expectation
 */
export default function (expectation) {

  return function (css, result) {

    css.eachRule(function (rule) {
      const selector = rule.selector

      // get out early if no pseudo elements or classes
      if (selector.indexOf(":") === -1) { return }

      // match only level 1 and 2 pseudo elements
      styleSearch({ source: selector, target: [ ":before", ":after", ":first-line", ":first-letter" ] }, match => {

        const prevCharIsColon = selector[match.startIndex - 1] === ":"

        if (expectation === "single" && !prevCharIsColon) { return }
        if (expectation === "double" && prevCharIsColon) { return }

        result.warn(messages.expected(expectation), { node: rule })
      })
    })
  }
}

import {
  report,
  ruleMessages,
  styleSearch,
  validateOptions,
} from "../../utils"

export const ruleName = "selector-pseudo-element-colon-notation"

export const messages = ruleMessages(ruleName, {
  expected: (q) => `Expected ${q} colon pseudo-element notation`,
})

export default function (expectation) {

  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: expectation,
      possible: [
        "single",
        "double",
      ],
    })
    if (!validOptions) { return }

    root.walkRules(rule => {
      const selector = rule.selector

      // get out early if no pseudo elements or classes
      if (selector.indexOf(":") === -1) { return }

      // match only level 1 and 2 pseudo elements
      styleSearch({ source: selector, target: [ ":before", ":after", ":first-line", ":first-letter" ] }, match => {

        const prevCharIsColon = selector[match.startIndex - 1] === ":"

        if (expectation === "single" && !prevCharIsColon) { return }
        if (expectation === "double" && prevCharIsColon) { return }

        report({
          message: messages.expected(expectation),
          node: rule,
          index: match.startIndex,
          result,
          ruleName,
        })
      })
    })
  }
}

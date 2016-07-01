import valueParser from "postcss-value-parser"
import {
  isStandardSyntaxValue,
  isVariable,
  report,
  ruleMessages,
  validateOptions,
} from "../../utils"

export const ruleName = "function-url-path"

export const messages = ruleMessages(ruleName, {
  expected: (path) => `Expected ${path} url`,
})

export default function (expectation) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: expectation,
      possible: [
        "absolute",
        "relative",
      ],
    })
    if (!validOptions) { return }

    root.walkDecls(function (decl) {
      valueParser(decl.value).walk(valueNode => {
        if (valueNode.type !== "function"
          || valueNode.value.toLowerCase() !== "url"
          || !valueNode.nodes.length > 0
        ) { return }

        const urlValueNode = valueNode.nodes[0]

        if (!urlValueNode.value
          || !isStandardSyntaxValue(urlValueNode.value)
          || isVariable(urlValueNode.value)
        ) { return }

        const urlValue = urlValueNode.value

        if (urlValue.toLowerCase().indexOf("data:") === 0 || urlValue.length < 1) {
          return
        }

        const isAbsoluteUrl = (/^(?:\/|[a-z]+:\/\/)/).test(urlValue)

        if (expectation === "absolute" && isAbsoluteUrl) {
          return
        } else if (expectation === "relative" && !isAbsoluteUrl) {
          return
        }

        report({
          message: messages.expected(expectation),
          node: decl,
          result,
          ruleName,
        })
      })
    })
  }
}

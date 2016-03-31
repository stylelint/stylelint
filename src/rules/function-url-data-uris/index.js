import valueParser from "postcss-value-parser"
import {
  cssWordIsVariable,
  report,
  ruleMessages,
  validateOptions,
} from "../../utils"

export const ruleName = "function-url-data-uris"

export const messages = ruleMessages(ruleName, {
  expected: "Expected data uris in function url",
  rejected: "Unexpected data uris in function url",
})

export default function (expectation) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: expectation,
      possible: [
        "always",
        "never",
      ],
    })
    if (!validOptions) { return }

    root.walkDecls(function (decl) {
      valueParser(decl.value).walk(valueNode => {
        if (valueNode.type !== "function" || valueNode.value !== "url" || !valueNode.nodes[0]) { return }

        const urlValueNode = valueNode.nodes[0]

        if (!urlValueNode.value || cssWordIsVariable(urlValueNode.value)) { return }

        const valueContainDataUris = urlValueNode.value.indexOf("data:") === 0
        const needUrlDataUris = expectation === "always"

        if (valueContainDataUris && needUrlDataUris
          || !valueContainDataUris && !needUrlDataUris
        ) { return }

        const message = needUrlDataUris ? messages.expected : messages.rejected

        report({
          message,
          node: decl,
          result,
          ruleName,
        })
      })
    })
  }
}

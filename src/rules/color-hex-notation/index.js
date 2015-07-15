import {
  report,
  ruleMessages,
  styleSearch
} from "../../utils"

export const ruleName = "color-hex-notation"

export const messages = ruleMessages(ruleName, {
  expected: (c, h) => `Expected ${c} hex color ${h}`,
})

/**
 * @param {"lowercase"|"uppercase"} expectation
 */
export default function (expectation) {
  return (root, result) => {
    root.eachDecl(decl => {
      const value = decl.value

      styleSearch({ source: value, target: "#" }, match => {

        const hexValue = /^#[0-9A-Za-z]+/.exec(value.substr(match.startIndex))[0]

        if (expectation === "lowercase" && (/^#(?:[0-9a-z]+)$/.test(hexValue))) { return }

        if (expectation === "uppercase" && (/^#(?:[0-9A-Z]+)$/.test(hexValue))) { return }

        report({
          message: messages.expected(expectation, hexValue),
          node: decl,
          result,
          ruleName,
        })
      })
    })
  }
}

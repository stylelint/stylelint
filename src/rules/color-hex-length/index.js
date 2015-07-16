import {
  report,
  ruleMessages,
  styleSearch
} from "../../utils"

export const ruleName = "color-hex-length"

export const messages = ruleMessages(ruleName, {
  expected: (l, h) => `Expected ${l} hex color ${h}`,
})

/**
 * @param {"short"|"long"} expectation
 */
export default function (expectation) {
  return (root, result) => {
    root.eachDecl(decl => {
      const value = decl.value

      styleSearch({ source: value, target: "#" }, match => {

        const hexValue = /^#[0-9A-Za-z]+/.exec(value.substr(match.startIndex))[0]

        if (expectation === "long" && hexValue.length !== 4 && hexValue.length !== 5) { return }

        if (expectation === "short" && (hexValue.length < 6 || !canShrink(hexValue))) { return }

        report({
          message: messages.expected(expectation, hexValue),
          node: decl,
          result,
          ruleName,
        })
      })
    })

    function canShrink(hex) {
      hex = hex.toLowerCase()

      return (
        hex[1] === hex[2] &&
        hex[3] === hex[4] &&
        hex[5] === hex[6] &&
        (hex.length === 7 || (hex.length === 9 && hex[7] === hex[8])))
    }
  }
}

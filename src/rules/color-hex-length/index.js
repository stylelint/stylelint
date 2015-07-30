import {
  report,
  ruleMessages,
  styleSearch,
  validateOptions
} from "../../utils"

export const ruleName = "color-hex-length"

export const messages = ruleMessages(ruleName, {
  expected: (h, v) => `Expected "${h}" to be "${v}"`,
})

export default function (expectation) {
  return (root, result) => {
    validateOptions({ result, ruleName,
      actual: expectation,
      possible: [
        "short",
        "long",
      ],
    })

    root.eachDecl(decl => {
      const value = decl.value

      styleSearch({ source: value, target: "#" }, match => {

        const hexValue = /^#[0-9A-Za-z]+/.exec(value.substr(match.startIndex))[0]

        if (expectation === "long" && hexValue.length !== 4 && hexValue.length !== 5) { return }

        if (expectation === "short" && (hexValue.length < 6 || !canShrink(hexValue))) { return }

        const variant = expectation === "long" ? longer : shorter

        report({
          message: messages.expected(hexValue, variant(hexValue)),
          node: decl,
          result,
          ruleName,
        })
      })
    })
  }
}

function canShrink(hex) {
  hex = hex.toLowerCase()

  return (
    hex[1] === hex[2] &&
    hex[3] === hex[4] &&
    hex[5] === hex[6] &&
    (hex.length === 7 || (hex.length === 9 && hex[7] === hex[8])))
}

function shorter(hex) {
  let hexVariant = "#"
  for (let i = 1; i < hex.length; i = i + 2) {
    hexVariant += hex[i]
  }
  return hexVariant
}

function longer(hex) {
  let hexVariant = "#"
  for (let i = 1; i < hex.length; i++) {
    hexVariant += hex[i] + hex[i]
  }
  return hexVariant
}

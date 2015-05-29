import {
  ruleMessages,
  styleSearch
} from "../../utils"

export const ruleName = "color-no-invalid-hex"

export const messages = ruleMessages(ruleName, {
  rejected: c => `Invalid hex color "${c}"`,
})

export default function () {
  return function (css, result) {
    css.eachDecl(function (decl) {
      const value = decl.value

      styleSearch({ source: value, target: "#" }, match => {
        console.log(match)
        const hexValue = /^#[0-9A-Za-z]+/.exec(value.substr(match.startIndex))[0]

        if (!/^#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(hexValue)) {
          result.warn(messages.rejected(hexValue), { node: decl })
        }
      })
    })
  }
}

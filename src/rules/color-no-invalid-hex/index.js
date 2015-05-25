import color from "color"
import {
  ruleMessages,
  valueIndexOf
} from "../../utils"

export const ruleName = "color-no-invalid-hex"

export const messages = ruleMessages(ruleName, {
  rejected: c => `Invalid hex color "${c}"`,
})

export default function () {
  return function (css, result) {
    css.eachDecl(function (decl) {
      const value = decl.value

      valueIndexOf({ value, char: "#" }, hashIndex => {
        const hexValue = /^#[0-9A-Za-z]+/.exec(value.substr(hashIndex))[0]
        try {
          color(hexValue)
        } catch (err) {
          // Ensure that this is the error we are looking for
          if (err.message.slice(0, 21) === "Unable to parse color") {
            result.warn(messages.rejected(hexValue), { node: decl })
          }
        }
      })
    })
  }
}

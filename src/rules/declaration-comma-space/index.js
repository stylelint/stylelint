import {
  standardWhitespaceOptions,
  standardWhitespaceChecker,
  standardWhitespaceMessages
} from "../../utils"

export const ruleName = "declaration-comma-space"

export const messages = standardWhitespaceMessages(ruleName, {
  expectedBefore: () => "Expected single space before comma within a declaration value",
  rejectedBefore: () => "Unexpected space before comma within a declaration value",
  expectedAfter: () => "Expected single space after comma within a declaration value",
  rejectedAfter: () => "Unexpected space after comma within a declaration value",
})

/**
 * @param {object} options
 * @param {"always"|"never"} [options.before]
 * @param {"always"|"never"} [options.after]
 */
export default function (options) {
  const spaceOptions = standardWhitespaceOptions(options)
  const spaceChecker = standardWhitespaceChecker(" ", spaceOptions, messages)

  return function (css, result) {
    css.eachDecl(function (decl) {
      // Content might contain commas that we do not care about,
      // so ignore it
      if (decl.prop === "content") { return }

      const value = decl.value
      let isInsideFunction = false
      for (let i = 0, l = value.length; i < l; i++) {
        const char = value[i]
        // If we are inside a function and not ending it, ignore
        if (isInsideFunction && char !== ")") { continue }
        // End of a function, so start inspecting any commas
        if (isInsideFunction && char === ")") {
          isInsideFunction = false
          continue
        }
        // Beginning of a function, so stop inspecting commas
        if (!isInsideFunction && char === "(") {
          isInsideFunction = true
          continue
        }
        if (!isInsideFunction && char === ",") {
          checkComma(i)
        }
      }

      function checkComma(index) {
        spaceChecker.before(value, index, msg => {
          result.warn(msg, { node: decl })
        })
        spaceChecker.after(value, index, msg => {
          result.warn(msg, { node: decl })
        })
      }
    })
  }
}

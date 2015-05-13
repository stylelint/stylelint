import {
  standardWhitespaceOptions,
  standardWhitespaceChecker,
  standardWhitespaceMessages
} from "../../utils"

export const ruleName = "function-comma-space"

export const messages = standardWhitespaceMessages(ruleName, {
  expectedBefore: () => `Expected single space before comma within a function`,
  rejectedBefore: () => `Unexpected space before comma within a function`,
  expectedAfter: () => `Expected single space after comma within a function`,
  rejectedAfter: () => `Unexpected space after comma within a function`,
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
      // Content might contain commas, cannot contain a function,
      // so ignore it
      if (decl.prop === "content") { return }

      const value = decl.value
      let isInsideFunction = false
      for (let i = 0, l = value.length; i < l; i++) {
        const char = value[i]

        // If we not inside or starting a function, ignore
        if (!isInsideFunction && char !== "(") { continue }

        // Beginning of a function, so start inspecting any commas
        if (!isInsideFunction && char === "(") {
          isInsideFunction = true
          continue
        }

        // End of a function, so stop inspecting commas
        if (isInsideFunction && char === ")") {
          isInsideFunction = false
          continue
        }

        if (isInsideFunction && char === ",") {
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

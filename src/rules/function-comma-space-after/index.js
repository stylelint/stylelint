import {
  ruleMessages,
  whitespaceChecker
} from "../../utils"

export const ruleName = "function-comma-space-before"

export const messages = ruleMessages(ruleName, {
  expectedAfter: () => `Expected single space after comma within a function`,
  rejectedAfter: () => `Unexpected space before comma within a function`,
})

/**
 * @param {"always"|"never"} expectation
 */
export default function (expectation) {
  const checker = whitespaceChecker(" ", expectation, messages)
  return functionCommaSpaceChecker(checker.after)
}

export function functionCommaSpaceChecker(checkLocation) {
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
          checkComma(value, i, decl)
        }
      }
    })

    function checkComma(str, index, node) {
      checkLocation(str, index, m => result.warn(m, { node }))
    }
  }
}

import {
  ruleMessages,
  whitespaceChecker
} from "../../utils"

export const ruleName = "declaration-comma-space-after"

export const messages = ruleMessages(ruleName, {
  expectedAfter: () => `Expected single space after comma within a declaration value`,
  rejectedAfter: () => `Unexpected space after comma within a declaration value`,
})

/**
 * @param {"always"|"never"} expectation
 */
export default function (expectation) {
  const checker = whitespaceChecker(" ", expectation, messages)
  return declarationCommaSpaceChecker(checker.after)
}

export function declarationCommaSpaceChecker(locationChecker) {
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
          check(value, i, decl)
        }
      }
    })

    function check(str, index, node) {
      locationChecker(str, index, m => result.warn(m, { node }))
    }
  }
}

import {
  isStandardSyntaxDeclaration,
  declarationValueIndex,
  report,
  ruleMessages,
  validateOptions,
  whitespaceChecker,
} from "../../utils"

export const ruleName = "declaration-colon-newline-after"

export const messages = ruleMessages(ruleName, {
  expectedAfter: () => "Expected newline after \":\"",
  rejectedAfter: () => "Unexpected whitespace after \":\"",
  expectedAfterMultiLine: () => "Expected newline after \":\" with a multi-line declaration",
})

export default function (expectation) {
  const checker = whitespaceChecker("newline", expectation, messages)
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: expectation,
      possible: [
        "always",
        "always-multi-line",
      ],
    })
    if (!validOptions) { return }

    root.walkDecls(decl => {

      if (!isStandardSyntaxDeclaration(decl)) { return }

      // Get the raw prop, and only the prop
      const endOfPropIndex = declarationValueIndex(decl) + decl.raw("between").length - 1

      // The extra characters tacked onto the end ensure that there is a character to check
      // after the colon. Otherwise, with `background:pink` the character after the
      const propPlusColon = decl.toString().slice(0, endOfPropIndex) + "xxx"

      for (let i = 0, l = propPlusColon.length; i < l; i++) {
        if (propPlusColon[i] !== ":") { continue }
        const indexToCheck = (propPlusColon.substr(propPlusColon[i], 3) === "/*")
          ? propPlusColon.indexOf("*/", i) + 1
          : i

        checker.afterOneOnly({
          source: propPlusColon,
          index: indexToCheck,
          lineCheckStr: decl.value,
          err: m => {
            report({
              message: m,
              node: decl,
              index: indexToCheck,
              result,
              ruleName,
            })
          },
        })
        break
      }
    })
  }
}

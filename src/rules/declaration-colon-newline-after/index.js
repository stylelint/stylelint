import {
  cssDeclarationIsMap,
  declarationValueIndexOffset,
  report,
  ruleMessages,
  validateOptions,
  whitespaceChecker,
} from "../../utils"

export const ruleName = "declaration-colon-newline-after"

export const messages = ruleMessages(ruleName, {
  expectedAfter: () => "Expected newline after \":\"",
  rejectedAfter: () => "Unexpected whitespace after \":\"",
  expectedAfterMultiLine: () => "Unexpected whitespace after \":\" with a multi-line value",
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

      if (cssDeclarationIsMap(decl)) { return }

      // Get the raw prop, and only the prop
      const endOfPropIndex = declarationValueIndexOffset(decl) + decl.raw("between").length - 1
      const declString = decl.toString().slice(0, endOfPropIndex)

      for (let i = 0, l = declString.length; i < l; i++) {
        if (declString[i] !== ":") { continue }
        const indexToCheck = (declString.substr(declString[i], 3) === "/*")
          ? declString.indexOf("*/", i) + 1
          : i
        checker.afterOneOnly({
          source: declString,
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

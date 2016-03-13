import {
  cssDeclarationIsMap,
  declarationValueIndexOffset,
  report,
  ruleMessages,
  validateOptions,
  whitespaceChecker,
} from "../../utils"

export const ruleName = "declaration-colon-space-after"

export const messages = ruleMessages(ruleName, {
  expectedAfter: () => "Expected single space after \":\"",
  rejectedAfter: () => "Unexpected whitespace after \":\"",
  expectedAfterSingleLine: () => "Expected single space after \":\" with a single-line value",
})

export default function (expectation) {
  const checker = whitespaceChecker("space", expectation, messages)
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: expectation,
      possible: [
        "always",
        "never",
        "always-single-line",
      ],
    })
    if (!validOptions) { return }

    declarationColonSpaceChecker({
      root,
      result,
      locationChecker: checker.after,
      checkedRuleName: ruleName,
    })
  }
}

export function declarationColonSpaceChecker({ locationChecker, root, result, checkedRuleName }) {
  root.walkDecls(decl => {

    if (cssDeclarationIsMap(decl)) { return }

    // Get the raw prop, and only the prop
    const endOfPropIndex = declarationValueIndexOffset(decl) + decl.raw("between").length - 1

    // The extra characters tacked onto the end ensure that there is a character to check
    // after the colon. Otherwise, with `background:pink` the character after the
    const propPlusColon = decl.toString().slice(0, endOfPropIndex) + "xxx"

    for (let i = 0, l = propPlusColon.length; i < l; i++) {
      if (propPlusColon[i] !== ":") { continue }
      locationChecker({
        source: propPlusColon,
        index: i,
        lineCheckStr: decl.value,
        err: m => {
          report({
            message: m,
            node: decl,
            index: decl.prop.toString().length + 1,
            result,
            ruleName: checkedRuleName,
          })
        },
      })
      break
    }
  })
}

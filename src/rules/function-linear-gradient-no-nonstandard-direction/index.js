import {
  cssFunctionArguments,
  report,
  ruleMessages,
  validateOptions,
} from "../../utils"

export const ruleName = "function-linear-gradient-no-nonstandard-direction"

export const messages = ruleMessages(ruleName, {
  rejected: "Unexpected nonstandard direction for linear-gradient",
})

function isStandardDirection(source) {
  const matches = source.match(/^to (top|left|bottom|right)(?: (top|left|bottom|right))?$/)
  if (!matches) { return false }
  if (matches.length === 2) { return true }
  // Cannot repeat side-or-corner, e.g. "to top top"
  if (matches.length === 3 && matches[1] !== matches[2]) { return true }
  return false
}

export default function (actual) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, { actual })
    if (!validOptions) { return }

    root.walkDecls(decl => {
      cssFunctionArguments(decl.toString(), "linear-gradient", (expression, expressionIndex) => {
        const firstArg = expression.split(",")[0].trim()

        // If the first character is a number, we can assume the user intends an angle
        if (/[\d\.]/.test(firstArg[0])) {
          if (/^[\d\.]+(?:deg|grad|rad|turn)$/.test(firstArg)) { return }
          warn()
          return
        }

        // The first argument may not be a direction: it may be an angle,
        // or a color stop (in which case user gets default direction, "to bottom")
        // cf. https://drafts.csswg.org/css-images-3/#linear-gradient-syntax
        if (!/left|right|top|bottom/.test(firstArg)) { return }

        if (!isStandardDirection(firstArg)) {
          warn()
          return
        }

        function warn() {
          report({
            message: messages.rejected,
            node: decl,
            index: expressionIndex,
            result,
            ruleName,
          })
        }
      })
    })
  }
}

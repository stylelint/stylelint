import postcss from "postcss"
import valueParser from "postcss-value-parser"
import {
  declarationValueIndexOffset,
  report,
  ruleMessages,
  validateOptions,
} from "../../utils"

export const ruleName = "time-no-imperceptible"

export const messages = ruleMessages(ruleName, {
  rejected: time => `Unexpected time value "${time}" less than or equal to 100ms`,
})

const LONGHAND_PROPERTIES_TO_CHECK = [
  "transition-duration", "transition-delay",
  "animation-duration", "animation-delay",
]

const SHORTHAND_PROPERTIES_TO_CHECK = [ "transition", "animation" ]

const MINIMUM_MILLISECONDS = 100

export default function (actual) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, { actual })
    if (!validOptions) { return }

    root.walkDecls(decl => {
      if (LONGHAND_PROPERTIES_TO_CHECK.indexOf(decl.prop) !== -1) {
        if (isImperceptibleTime(decl.value)) {
          complain(messages.rejected(decl.value), decl)
        }
      }

      if (SHORTHAND_PROPERTIES_TO_CHECK.indexOf(decl.prop) !== -1) {
        const valueList = postcss.list.space(decl.value)
        for (const value of valueList) {
          if (isImperceptibleTime(value)) {
            complain(messages.rejected(value), decl, decl.value.indexOf(value))
          }
        }
      }
    })

    function isImperceptibleTime(time) {
      const parsedTime = valueParser.unit(time)
      if (!parsedTime) return false
      if (parsedTime.unit === "ms" && parsedTime.number <= MINIMUM_MILLISECONDS) { return true }
      if (parsedTime.unit === "s" && parsedTime.number * 1000 <= MINIMUM_MILLISECONDS) { return true }
      return false
    }

    function complain(message, decl, offset = 0) {
      report({
        result,
        ruleName,
        message,
        index: declarationValueIndexOffset(decl) + offset,
        node: decl,
      })
    }
  }
}

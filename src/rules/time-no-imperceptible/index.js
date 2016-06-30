import postcss from "postcss"
import valueParser from "postcss-value-parser"
import {
  declarationValueIndex,
  report,
  ruleMessages,
  validateOptions,
} from "../../utils"
import {
  longhandTimeProperties,
  shorthandTimeProperties,
} from "../../reference/keywordSets"

export const ruleName = "time-no-imperceptible"

export const messages = ruleMessages(ruleName, {
  rejected: time => `Unexpected time value "${time}" less than or equal to 100ms`,
})

const MINIMUM_MILLISECONDS = 100

export default function (actual) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, { actual })
    if (!validOptions) { return }

    root.walkDecls(decl => {
      if (longhandTimeProperties.has(decl.prop.toLowerCase())) {
        if (isImperceptibleTime(decl.value)) {
          complain(messages.rejected(decl.value), decl)
        }
      }

      if (shorthandTimeProperties.has(decl.prop.toLowerCase())) {
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
      const absoluteTime = Math.abs(parsedTime.number)
      if (parsedTime.unit.toLowerCase() === "ms" && absoluteTime <= MINIMUM_MILLISECONDS) { return true }
      if (parsedTime.unit.toLowerCase() === "s" && absoluteTime * 1000 <= MINIMUM_MILLISECONDS) { return true }
      return false
    }

    function complain(message, decl, offset = 0) {
      report({
        result,
        ruleName,
        message,
        index: declarationValueIndex(decl) + offset,
        node: decl,
      })
    }
  }
}

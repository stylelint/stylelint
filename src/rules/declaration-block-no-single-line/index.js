import {
  cssStatementBlockString,
  cssStatementStringBeforeBlock,
  isSingleLineString,
  report,
  ruleMessages,
  validateOptions,
} from "../../utils"

export const ruleName = "declaration-block-no-single-line"

export const messages = ruleMessages(ruleName, {
  rejected: `Unexpected single-line declaration block`,
})

export default function (actual) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, { actual })
    if (!validOptions) { return }

    root.walkRules(rule => {

      if (!isSingleLineString(cssStatementBlockString(rule))) { return }

      report({
        message: messages.rejected,
        node: rule,
        index: cssStatementStringBeforeBlock(rule, { noBefore: true }).length,
        result,
        ruleName,
      })
    })
  }
}

import { vendor } from "postcss"
import {
  report,
  ruleMessages,
  validateOptions,
} from "../../utils"

export const ruleName = "keyframe-declaration-no-important"

export const messages = ruleMessages(ruleName, {
  rejected: "Unexpected !important within declarations in a keyframe",
})

export default function (actual) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, { actual })
    if (!validOptions) { return }
    root.walkAtRules(/keyframes$/i, atRuleKeyframes => {
      if (vendor.unprefixed(atRuleKeyframes.name).toLowerCase() !== "keyframes") { return }

      atRuleKeyframes.walkDecls(decl => {
        if (!decl.important) {
          return
        }

        report({
          message: messages.rejected,
          node: decl,
          word: "important",
          result,
          ruleName,
        })
      })
    })
  }
}

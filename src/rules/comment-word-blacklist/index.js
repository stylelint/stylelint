import { isString } from "lodash"
import {
  report,
  ruleMessages,
  validateOptions,
  matchesStringOrRegExp,
} from "../../utils"

export const ruleName = "comment-word-blacklist"

export const messages = ruleMessages(ruleName, {
  rejected: (pattern) => `Unexpected word matching pattern "${pattern}"`,
})

export default function (blacklist) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: blacklist,
      possible: [isString],
    })
    if (!validOptions) { return }

    root.walkComments(comment => {
      const text = comment.text
      const rawComment = comment.toString()
      const firstFourChars = rawComment.substr(0, 4)

      // Return early if sourcemap or copyright comment
      if (firstFourChars === "/*# " || firstFourChars === "/*! ") { return }

      const matchesWord = matchesStringOrRegExp(text, blacklist)

      if (!matchesWord) { return }

      report({
        message: messages.rejected(matchesWord.pattern),
        node: comment,
        result,
        ruleName,
      })
    })
  }
}

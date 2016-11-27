const containsString = require("../../utils/containsString")
const matchesStringOrRegExp = require("../../utils/matchesStringOrRegExp")
const report = require("../../utils/report")
const ruleMessages = require("../../utils/ruleMessages")
const validateOptions = require("../../utils/validateOptions")
import { isString } from "lodash"

export const ruleName = "comment-word-blacklist"

export const messages = ruleMessages(ruleName, {
  rejected: pattern => `Unexpected word matching pattern "${pattern}"`,
})

function rule(blacklist) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: blacklist,
      possible: [isString],
    })
    if (!validOptions) {
      return
    }

    root.walkComments(comment => {
      const text = comment.text
      const rawComment = comment.toString()
      const firstFourChars = rawComment.substr(0, 4)

      // Return early if sourcemap
      if (firstFourChars === "/*# ") {
        return
      }

      const matchesWord = matchesStringOrRegExp(text, blacklist) || containsString(text, blacklist)

      if (!matchesWord) {
        return
      }

      report({
        message: messages.rejected(matchesWord.pattern),
        node: comment,
        result,
        ruleName,
      })
    })
  }
}

rule.primaryOptionArray = true

module.exports = rule

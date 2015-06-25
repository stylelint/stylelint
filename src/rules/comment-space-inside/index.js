import {
  report,
  ruleMessages
} from "../../utils"

export const ruleName = "comment-space-inside"

export const messages = ruleMessages(ruleName, {
  expectedOpening: `Expected single space after "/*`,
  rejectedOpening: `Unexpected whitespace after "/*`,
  expectedClosing: `Expected single space before "*/"`,
  rejectedClosing: `Unexpected whitespace before "*/"`,
})

/**
 * @param {"always"|"never"} expectation
 */
export default function (expectation) {
  return function (css, result) {
    css.eachComment(function (comment) {

      const left = comment.left
      const right = comment.right

      if (left !== "" && expectation === "never") {
        report({
          message: messages.rejectedOpening,
          node: comment,
          result,
          ruleName,
        })
      }
      if (left !== " " && expectation === "always") {
        report({
          message: messages.expectedOpening,
          node: comment,
          result,
          ruleName,
        })
      }

      if (right !== "" && expectation === "never") {
        report({
          message: messages.rejectedClosing,
          node: comment,
          result,
          ruleName,
        })
      }
      if (right !== " " && expectation === "always") {
        report({
          message: messages.expectedClosing,
          node: comment,
          result,
          ruleName,
        })
      }
    })
  }
}

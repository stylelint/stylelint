import {
  hasBlock,
  optionsHaveException,
  optionsHaveIgnored,
  report,
  ruleMessages
} from "../../utils"

export const ruleName = "at-rule-empty-line-before"

export const messages = ruleMessages(ruleName, {
  expected: "Expected empty line before at-rule",
  rejected: "Unexpected empty line before at-rule",
})

/**
 * @param {"always"|"never"} expectation
 * @param {object} options - Can contain the following:
 *   - except: ["blockless-group"]
 *   - ignore: ["blockless-group"]
 */
export default function (expectation, options) {
  return (root, result) => {
    root.eachAtRule(atRule => {

      // Ignore the first node
      if (atRule === root.first) { return }

      const emptyLineBefore = atRule.before.indexOf("\n\n") !== -1

      let expectEmptyLineBefore = (expectation === "always") ? true : false

      if (options) {

        // if this at-rule and the one before it are are blockless, then reverse the expectation
        if (optionsHaveException(options, "blockless-group") && isInBlocklessGroup(atRule)) {
          expectEmptyLineBefore = !expectEmptyLineBefore
        }

        if (optionsHaveIgnored(options, "blockless-group") && isInBlocklessGroup(atRule)) {
          return
        }
      }

      // return if our expectation is met for this at-rule
      if (expectEmptyLineBefore === emptyLineBefore) { return }

      const message = expectEmptyLineBefore ? messages.expected : messages.rejected

      report({
        message: message,
        node: atRule,
        result,
        ruleName,
      })

      function isInBlocklessGroup(aR) {
        const previousNode = aR.prev()

        return (previousNode
            && previousNode.type === "atrule"
            && !hasBlock(previousNode)
            && !hasBlock(aR))
      }
    })
  }
}

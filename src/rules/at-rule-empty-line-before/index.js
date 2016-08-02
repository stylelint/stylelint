import {
  hasBlock,
  hasEmptyLine,
  optionsHaveException,
  optionsHaveIgnored,
  optionsHaveIgnoredAtRule,
  report,
  ruleMessages,
  validateOptions,
} from "../../utils"
import { isString } from "lodash"

export const ruleName = "at-rule-empty-line-before"

export const messages = ruleMessages(ruleName, {
  expected: "Expected empty line before at-rule",
  rejected: "Unexpected empty line before at-rule",
})

export default function (expectation, options) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: expectation,
      possible: [ "always", "never" ],
    }, {
      actual: options,
      possible: {
        except: [
          "all-nested",
          "blockless-after-same-name-blockless",
          "blockless-group",
          "first-nested",
        ],
        ignore: [
          "after-comment",
          "all-nested",
          "blockless-after-same-name-blockless",
          "blockless-group",
        ],
        ignoreAtRules: [isString],
      },
      optional: true,
    })
    if (!validOptions) { return }

    root.walkAtRules(atRule => {

      // Ignore the first node
      if (atRule === root.first) { return }

      // Return early if at-rule is to be ignored
      if (optionsHaveIgnoredAtRule(options, atRule)) { return }

      // Optionally ignore the expectation if the node is blockless
      if (optionsHaveIgnored(options, "blockless-group")
        && !hasBlock(atRule)) { return }

      const isNested = atRule.parent !== root
      const previousNode = atRule.prev()

      // Optionally ignore the expection if the node is blockless
      // and following another blockless at-rule with the same name
      if (optionsHaveIgnored(options, "blockless-after-same-name-blockless")
        && isBlocklessAfterSameNameBlockless()) { return }

      // Optionally ignore the expectation if the node is nested
      if (optionsHaveIgnored(options, "all-nested")
        && isNested) { return }

      // Optionally ignore the expectation if a comment precedes this node
      if (optionsHaveIgnored(options, "after-comment")
        && isAfterComment()) { return }

      const hasEmptyLineBefore = hasEmptyLine(atRule.raw("before"))
      let expectEmptyLineBefore = (expectation === "always") ? true : false

      // Optionally reverse the expectation if any exceptions apply
      if (
        ((optionsHaveException(options, "all-nested")
          && isNested))
        || (optionsHaveException(options, "first-nested")
          && isFirstNested())
        || (optionsHaveException(options, "blockless-group")
          && isBlocklessAfterBlockless())
        || (optionsHaveException(options, "blockless-after-same-name-blockless")
          && isBlocklessAfterSameNameBlockless())
      ) {
        expectEmptyLineBefore = !expectEmptyLineBefore
      }

      // Return if the expectation is met
      if (expectEmptyLineBefore === hasEmptyLineBefore) { return }

      const message = expectEmptyLineBefore ? messages.expected : messages.rejected

      report({
        message,
        node: atRule,
        result,
        ruleName,
      })

      function isAfterComment() {
        return (
          previousNode
          && previousNode.type === "comment"
        )
      }

      function isBlocklessAfterBlockless() {
        return (
          previousNode && previousNode.type === "atrule"
          && !hasBlock(previousNode)
          && !hasBlock(atRule)
        )
      }

      function isBlocklessAfterSameNameBlockless() {
        return (
          !hasBlock(atRule)
          && previousNode && !hasBlock(previousNode)
          && previousNode.type === "atrule"
          && previousNode.name == atRule.name
        )
      }

      function isFirstNested() {
        return (
          isNested
          && atRule === atRule.parent.first
        )
      }
    })
  }
}

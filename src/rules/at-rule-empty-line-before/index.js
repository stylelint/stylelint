import {
  hasBlock,
  hasEmptyLine,
  optionsHasKeyword,
  optionsMatches,
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
        except: [ "blockless-group", "first-nested", "all-nested" ],
        ignore: [ "blockless-group", "after-comment", "all-nested" ],
        ignoreAtRules: [isString],
      },
      optional: true,
    })
    if (!validOptions) { return }

    root.walkAtRules(atRule => {

      // Ignore the first node
      if (atRule === root.first) { return }

      // Return early if at-rule is to be ignored
      if (optionsMatches(options, "ignoreAtRules", atRule)) { return }

      // Optionally ignore the expectation if the node is blockless
      if (optionsHasKeyword(options, "ignore", "blockless-group") && !hasBlock(atRule)) { return }

      // Optionally ignore the expectation if the node is nested
      const isNested = atRule.parent !== root
      if (optionsHasKeyword(options, "ignore", "all-nested") && isNested) { return }

      // Optionally ignore the expectation if a comment precedes this node
      if (optionsHasKeyword(options, "ignore", "after-comment")
        && atRule.prev() && atRule.prev().type === "comment") { return }

      const hasEmptyLineBefore = hasEmptyLine(atRule.raw("before"))

      let expectEmptyLineBefore = (expectation === "always") ? true : false

      const previousNode = atRule.prev()

      // Reverse the expectation if any exceptions apply
      if (
        (optionsHasKeyword(options, "except", "all-nested") && isNested)
        || getsFirstNestedException()
        || getsBlocklessGroupException()
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

      function getsBlocklessGroupException() {
        return (
          optionsHasKeyword(options, "except", "blockless-group")
          && previousNode && previousNode.type === "atrule"
          && !hasBlock(previousNode)
          && !hasBlock(atRule)
        )
      }

      function getsFirstNestedException() {
        return (
          optionsHasKeyword(options, "except", "first-nested")
          && isNested
          && atRule === atRule.parent.first
        )
      }
    })
  }
}

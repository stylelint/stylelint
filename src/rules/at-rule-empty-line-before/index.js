import {
  cssStatementHasBlock,
  optionsHaveException,
  optionsHaveIgnored,
  report,
  ruleMessages,
  validateOptions,
} from "../../utils"

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
        ignore: [ "after-comment", "all-nested" ],
      },
      optional: true,
    })
    if (!validOptions) { return }

    root.walkAtRules(atRule => {

      // Ignore the first node
      if (atRule === root.first) { return }

      const isNested = atRule.parent !== root
      if (optionsHaveIgnored(options, "all-nested") && isNested) { return }

      // Optionally ignore the expectation if a comment precedes this node
      if (optionsHaveIgnored(options, "after-comment")
        && atRule.prev() && atRule.prev().type === "comment") { return }

      const before = atRule.raw("before")
      const emptyLineBefore = before && (
        before.indexOf("\n\n") !== -1
        || before.indexOf("\r\n\r\n") !== -1
        || before.indexOf("\n\r\n") !== -1
      )

      let expectEmptyLineBefore = (expectation === "always") ? true : false

      const previousNode = atRule.prev()

      // Reverse the expectation if any exceptions apply
      if (
        (optionsHaveException(options, "all-nested") && isNested)
        || getsFirstNestedException()
        || getsBlocklessGroupException()
      ) {
        expectEmptyLineBefore = !expectEmptyLineBefore
      }

      // Return if the exceptation is met
      if (expectEmptyLineBefore === emptyLineBefore) { return }

      const message = expectEmptyLineBefore ? messages.expected : messages.rejected

      report({
        message,
        node: atRule,
        result,
        ruleName,
      })

      function getsBlocklessGroupException() {
        return (
          optionsHaveException(options, "blockless-group")
          && previousNode && previousNode.type === "atrule"
          && !cssStatementHasBlock(previousNode)
          && !cssStatementHasBlock(atRule)
        )
      }

      function getsFirstNestedException() {
        return (
          optionsHaveException(options, "first-nested")
          && isNested
          && atRule === atRule.parent.first
        )
      }
    })
  }
}

import {
  hasEmptyLine,
  isCustomProperty,
  optionsHaveException,
  report,
  ruleMessages,
  validateOptions,
} from "../../utils"

export const ruleName = "custom-property-empty-line-before"

export const messages = ruleMessages(ruleName, {
  expected: "Expected empty line before custom property",
  rejected: "Unexpected empty line before custom property",
})

export default function (expectation, options) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: expectation,
      possible: [
        "always",
        "never",
      ],
    }, {
      actual: options,
      possible: {
        except: [
          "first-nested",
          "after-comment",
          "after-custom-property",
        ],
      },
      optional: true,
    })
    if (!validOptions) { return }
    root.walkRules(rule => {

      rule.walkDecls(decl => {
        const { prop } = decl
        if (!isCustomProperty(prop)) { return }

        let expectEmptyLineBefore = (expectation === "always") ? true : false

        // Optionally reverse the expectation for the first nested node
        if (optionsHaveException(options, "first-nested")
          && decl === decl.parent.first) {
          expectEmptyLineBefore = !expectEmptyLineBefore
        }

        // Optionally ignore the expectation if a comment precedes this node
        if (optionsHaveException(options, "after-comment")
          && decl.prev()
          && decl.prev().type === "comment") {
          expectEmptyLineBefore = !expectEmptyLineBefore
        }

        // Optionally ignore the expectation if a custom property precedes this node
        if (optionsHaveException(options, "after-custom-property")
          && decl.prev()
          && decl.prev().prop
          && isCustomProperty(decl.prev().prop)) {
          expectEmptyLineBefore = !expectEmptyLineBefore
        }

        const hasEmptyLineBefore = hasEmptyLine(decl.raws["before"])

        // Return if the expectation is met
        if (expectEmptyLineBefore === hasEmptyLineBefore) { return }

        const message = expectEmptyLineBefore ? messages.expected : messages.rejected
        report({
          message,
          node: decl,
          result,
          ruleName,
        })
      })
    })
  }
}

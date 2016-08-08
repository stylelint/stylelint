import {
  blockString,
  hasEmptyLine,
  isCustomProperty,
  isSingleLineString,
  isStandardSyntaxDeclaration,
  optionsMatches,
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
        ignore: [
          "after-comment",
          "inside-single-line-block",
        ],
      },
      optional: true,
    })
    if (!validOptions) { return }

    root.walkDecls(decl => {
      const { prop, parent } = decl

      if (!isStandardSyntaxDeclaration(decl)) { return }
      if (!isCustomProperty(prop)) { return }

      // Optionally ignore the node if a comment precedes it
      if (
        optionsMatches(options, "ignore", "after-comment")
        && decl.prev()
        && decl.prev().type === "comment"
      ) {
        return
      }

      // Optionally ignore nodes inside single-line blocks
      if (
        optionsMatches(options, "ignore", "inside-single-line-block")
        && isSingleLineString(blockString(parent))
      ) {
        return
      }

      let expectEmptyLineBefore = (expectation === "always") ? true : false

      // Optionally reverse the expectation for the first nested node
      if (optionsMatches(options, "except", "first-nested")
        && decl === parent.first) {
        expectEmptyLineBefore = !expectEmptyLineBefore
      }

      // Optionally reverse the expectation if a comment precedes this node
      if (optionsMatches(options, "except", "after-comment")
        && decl.prev()
        && decl.prev().type === "comment") {
        expectEmptyLineBefore = !expectEmptyLineBefore
      }

      // Optionally reverse the expectation if a custom property precedes this node
      if (optionsMatches(options, "except", "after-custom-property")
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
  }
}

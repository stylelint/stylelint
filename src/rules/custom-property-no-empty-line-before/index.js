import {
  isCustomProperty,
  optionsHaveException,
  report,
  ruleMessages,
  validateOptions,
} from "../../utils"
import _ from "lodash"

export const ruleName = "custom-property-no-empty-line-before"

export const messages = ruleMessages(ruleName, {
  expected: "Expected single line before custom property",
  rejected: "Unexpected single line before custom property",
})

export default function (expectation, options) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: expectation,
      possible: [
        true,
      ],
    }, {
      actual: options,
      possible: {
        except: ["first-after-non-custom-property-sibling"],
      },
      optional: true,
    })
    if (!validOptions) { return }
    const allPropData = []
    root.walkDecls(decl => {
      const { prop } = decl

      const propData = prop

      const previousPropData = _.last(allPropData)
      allPropData.push(propData)
      if (isCustomProperty(prop)) {
        const before = decl.raws["before"]

        const hasEmptyLineBefore = before.indexOf("\n\n") !== -1
        || before.indexOf("\r\n\r\n") !== -1
        || before.indexOf("\n\r\n") !== -1

        // return if it is first after a non custom property
        if (optionsHaveException(options, "first-after-non-custom-property-sibling") && previousPropData !== undefined && !isCustomProperty(previousPropData)) { expectation = !expectation }

        if (expectation === !hasEmptyLineBefore) { return }
        const message = expectation ? messages.rejected : messages.expected
        report({
          message,
          node: decl,
          result,
          ruleName,
        })
      }

    })
  }
}

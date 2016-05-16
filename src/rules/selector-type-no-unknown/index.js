import { isString } from "lodash"
import htmlTags from "html-tags"
import svgTags from "svg-tags"
import {
  parseSelector,
  report,
  ruleMessages,
  validateOptions,
} from "../../utils"

export const ruleName = "selector-type-no-unknown"

export const messages = ruleMessages(ruleName, {
  rejected: (selector) => `Unexpected unknown type selector "${selector}"`,
})

export default function (actual, options) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, { actual }, {
      actual: options,
      possible: {
        ignoreTypes: [isString],
      },
      optional: true,
    })
    if (!validOptions) { return }

    root.walkRules(rule => {
      const selector = rule.selector

      parseSelector(selector, result, rule, selectorTree => {
        selectorTree.walkTags(tagNode => {
          const tagName = tagNode.value
          const tagNameLowerCase = tagName.toLowerCase()

          if (htmlTags.indexOf(tagNameLowerCase) !== -1
            || svgTags.indexOf(tagNameLowerCase) !== -1
          ) { return }

          const ignoreTypes = options && options.ignoreTypes || []

          if (ignoreTypes.indexOf(tagNameLowerCase) !== -1) { return }

          report({
            message: messages.rejected(tagName),
            node: rule,
            index: tagNode.sourceIndex,
            ruleName,
            result,
          })
        })
      })
    })
  }
}

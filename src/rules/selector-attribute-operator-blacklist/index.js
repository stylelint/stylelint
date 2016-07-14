import {
  isStandardSyntaxRule,
  parseSelector,
  report,
  ruleMessages,
  validateOptions,
} from "../../utils"
import { isString } from "lodash"

export const ruleName = "selector-attribute-operator-blacklist"

export const messages = ruleMessages(ruleName, {
  rejected: (operator) => `Unexpected operator "${operator}"`,
})

function rule(blacklistInput) {
  const blacklist = [].concat(blacklistInput)
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: blacklist,
      possible: [isString],
    })
    if (!validOptions) { return }

    root.walkRules(rule => {
      if (!isStandardSyntaxRule(rule)) { return }
      if (rule.selector.indexOf("[") === -1
        || rule.selector.indexOf("=") === -1
      ) { return }

      parseSelector(rule.selector, result, rule, selectorTree => {
        selectorTree.walkAttributes(attributeNode => {
          const operator = attributeNode.operator

          if (!operator || (operator && blacklist.indexOf(operator) === -1)) { return }

          report({
            message: messages.rejected(operator),
            node: rule,
            index: attributeNode.attribute.length + 1,
            result,
            ruleName,
          })
        })
      })
    })
  }
}

rule.primaryOptionArray = true

export default rule

import _ from "lodash"
import { standardWhitespaceOptions,
  standardWhitespaceChecker,
  standardWhitespaceMessages } from "../../utils"

export const ruleName = "selector-combinator-space"

export const messages = standardWhitespaceMessages(ruleName, {
  expectedBefore: c => `Expected single space before combinator "${c}"`,
  rejectedBefore: c => `Expected no space before combinator "${c}"`,
  expectedAfter: c => `Expected single space after combinator "${c}"`,
  rejectedAfter: c => `Expected no space after combinator "${c}"`,
})

const combinators = [ ">", "+", "~" ]

/**
 * @param {object} options
 * @param {"always"|"never"} [options.before]
 * @param {"always"|"never"} [options.after]
 */
export default function (options) {
  const spaceOptions = standardWhitespaceOptions(options)
  const spaceChecker = standardWhitespaceChecker(" ", spaceOptions, messages)

  return function (css, result) {
    css.eachRule(function (rule) {
      const selector = rule.selector
      _.forEach(selector, (char, i) => {
        if (!_.includes(combinators, char)) { return }
        spaceChecker.before(selector, i, msg => {
          result.warn(msg, { node: rule })
        })
        spaceChecker.after(selector, i, msg => {
          result.warn(msg, { node: rule })
        })
      })
    })
  }
}

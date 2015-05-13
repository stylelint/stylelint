import {
  standardWhitespaceOptions,
  standardWhitespaceChecker,
  standardWhitespaceMessages
} from "../../utils"

export const ruleName = "declaration-colon-space"

export const messages = standardWhitespaceMessages(ruleName, {
  expectedBefore: () => `Expected single space before ":"`,
  rejectedBefore: () => `Expected no space before ":"`,
  expectedAfter: () => `Expected single space after ":"`,
  rejectedAfter: () => `Expected no space after ":"`,
})

/**
 * @param {object} options
 * @param {"always"|"never"} [options.before]
 * @param {"always"|"never"} [options.after]
 */
export default function (options) {
  return function (css, result) {

    if (!options) { return }

    const spaceOptions = standardWhitespaceOptions(options)
    const spaceChecker = standardWhitespaceChecker(" ", spaceOptions, messages)

    css.eachDecl(function (decl) {

      const between = decl.between
      const charIndex = between.indexOf(":")

      spaceChecker.before(between, charIndex, msg => {
        result.warn(msg, { node: decl })
      })

      spaceChecker.after(between, charIndex, msg => {
        result.warn(msg, { node: decl })
      })
    })
  }
}

import {
  standardWhitespaceOptions,
  standardWhitespaceChecker,
  standardWhitespaceMessages
} from "../../utils"

export const ruleName = "declaration-colon-space"

export const messages = standardWhitespaceMessages(ruleName, {
  expectedBefore: () => `Expected single space before ":"`,
  rejectedBefore: () => `Unexpected space before ":"`,
  expectedAfter: () => `Expected single space after ":"`,
  rejectedAfter: () => `Unexpected space after ":"`,
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

      const declString = decl.toString()

      for (let i = 0, l = declString.length; i < l; i++) {
        if (declString[i] !== ":") { continue }
        checkColon(i)
        break
      }

      function checkColon(index) {
        spaceChecker.before(declString, index, msg => {
          result.warn(msg, { node: decl })
        })
        spaceChecker.after(declString, index, msg => {
          result.warn(msg, { node: decl })
        })
      }
    })
  }
}

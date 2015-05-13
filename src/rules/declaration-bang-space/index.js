import {
  standardWhitespaceOptions,
  standardWhitespaceChecker,
  standardWhitespaceMessages
} from "../../utils"

export const ruleName = "declaration-bang-space"

export const messages = standardWhitespaceMessages(ruleName, {
  expectedBefore: () => `Expected single space before "!"`,
  rejectedBefore: () => `Expected no space before "!"`,
  expectedAfter: () => `Expected single space after "!"`,
  rejectedAfter: () => `Expected no space after "!"`,
})

/**
 * @param {object} options
 * @param {"always"|"never"} [options.before]
 * @param {"always"|"never"} [options.after]
 */
export default function (options) {
  const spaceOptions = standardWhitespaceOptions(options)
  const spaceChecker = standardWhitespaceChecker(" ", spaceOptions, messages)

  return function (css, result) {
    css.eachDecl(function (decl) {
      if (!decl.important) { return }
      const declString = decl.toString()

      // Start from the right and only pay attention to the first
      // exclamation mark found
      for (let i = declString.length - 1; i >= 0; i--) {
        if (declString[i] !== "!") { continue }
        checkBang(i)
        break
      }

      function checkBang(index) {
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

import isWhitespace from "./isWhitespace"
import isSingleLineString from "./isSingleLineString"

/**
 * Create a whitespaceChecker, which exposes the following functions:
 * - `before()`
 * - `after()`
 * - `afterOneOnly()`
 *
 * @param {" "|"\n"} targetWhitespace
 * @param {"always"} expectation - One of the "always"/"never" strings
 * @param {object} messages - An object of message functions;
 *   calling `before()` or `after()` and the `expectation` that is passed
 *   determines which message functions are required
 * @param {function} [messages.exectedBefore]
 * @param {function} [messages.rejectedBefore]
 * @param {function} [messages.expectedAfter]
 * @param {function} [messages.rejectedAfter]
 * @param {function} [messages.expectedBeforeSingleLine]
 * @param {function} [messages.rejectedBeforeSingleLine]
 * @param {function} [messages.expectedBeforeMultiLine]
 * @param {function} [messages.rejectedBeforeMultiLine]
 * @return {object} The checker
 */
export default function (targetWhitespace, expectation, messages) {

  // Keep track of active arguments in order to avoid passing
  // too much stuff around, making signatures confusing.
  // This variable gets reset anytime `before()` or `after()` is called.
  let activeArgs

  /**
   * Check for whitespace before a character.
   *
   * @param {string} source
   * @param {number} index - The index of the character to check before
   * @param {function} err - A callback that receives the warning message
   *   if there is one. Typically this callback will register the message
   *   as a warning on the PostCSS result that the rule is dealing with.
   * @param {string} [lineCheckStr] - Single- and multi-line checkers
   *   will use this string to check whether they should proceed. If none
   *   is passed, they will use `source`.
   * @param {string} [onlyOneChar=false] - Only check *one* character before.
   *   By default, "always-*" checks will look for the `targetWhitespace` one
   *   before and then ensure there is no whitespace two before; this option
   *   bypasses that second check.
   */
  function before(source, index, err, lineCheckStr, onlyOneChar=false) {
    activeArgs = { source, index, err, onlyOneChar }
    switch (expectation) {
      case "always":
        expectBefore()
        break
      case "never":
        rejectBefore()
        break
      case "always-single-line":
        if (!isSingleLineString(lineCheckStr || source)) { return }
        expectBefore(messages.expectedBeforeSingleLine)
        break
      case "never-single-line":
        if (!isSingleLineString(lineCheckStr || source)) { return }
        rejectBefore(messages.rejectedBeforeSingleLine)
        break
      case "always-multi-line":
        if (isSingleLineString(lineCheckStr || source)) { return }
        expectBefore(messages.expectedBeforeMultiLine)
        break
      case "never-multi-line":
        if (isSingleLineString(lineCheckStr || source)) { return }
        rejectBefore(messages.rejectedBeforeMultiLine)
        break
      default:
        throw new Error(`Unknown expectation "${expectation}"`)
    }
  }

  /**
   * Check for whitespace after a character.
   *
   * Parameters are the same as for `before()`, above, just substitute
   * the word "after" for "before".
   */
  function after(source, index, err, lineCheckStr, onlyOneChar=false) {
    activeArgs = { source, index, err, onlyOneChar }
    switch (expectation) {
      case "always":
        expectAfter()
        break
      case "never":
        rejectAfter()
        break
      default:
        throw new Error(`Unknown expectation "${expectation}"`)
    }
  }

  function expectBefore(messageFunc=messages.expectedBefore) {
    const { source, index } = activeArgs
    const oneCharBefore = source[index - 1]
    const twoCharsBefore = source[index - 2]

    if ((isValue(oneCharBefore) && oneCharBefore !== targetWhitespace)
      || (!activeArgs.onlyOneChar && isValue(twoCharsBefore) && isWhitespace(twoCharsBefore))) {
      activeArgs.err(messageFunc(source[index]))
    }
  }

  function rejectBefore(messageFunc=messages.rejectedBefore) {
    const { source, index } = activeArgs
    const oneCharBefore = source[index - 1]

    if (isValue(oneCharBefore) && isWhitespace(oneCharBefore)) {
      activeArgs.err(messageFunc(source[index]))
    }
  }

  function afterOneOnly(source, index, err, lineCheckStr) {
    after(source, index, err, lineCheckStr, true)
  }

  function expectAfter(messageFunc=messages.expectedAfter) {
    const { source, index } = activeArgs
    const oneCharAfter = source[index + 1]
    const twoCharsAfter = source[index + 2]

    if ((isValue(oneCharAfter) && oneCharAfter !== targetWhitespace)
      || (!activeArgs.onlyOneChar && isValue(twoCharsAfter) && isWhitespace(twoCharsAfter))) {
      activeArgs.err(messageFunc(source[index]))
    }
  }

  function rejectAfter(messageFunc=messages.rejectedAfter) {
    const { source, index } = activeArgs
    const oneCharAfter = source[index + 1]

    if (isValue(oneCharAfter) && isWhitespace(oneCharAfter)) {
      activeArgs.err(messageFunc(source[index]))
    }
  }

  return {
    before,
    after,
    afterOneOnly,
  }
}

function isValue(x) {
  return x !== undefined && x !== null
}

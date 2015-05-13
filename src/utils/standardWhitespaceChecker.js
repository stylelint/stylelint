/**
 * Create a standardWhitespaceChecker that exposes `before()` and `after()`
 * functions for checking whitespace around a given point in a string.
 *
 * @param {string} whitespace - The whitespace to look for
 * @param {object} whitespaceOptions - A set of options created by
 *   `standardWhitespaceOptions()`; so it will have properties
 *   `expectBefore`, `expectAfter`, `rejectBefore`, etc.
 * @param {object} whitespaceMessages - A set of messages passed through
 *   `standardWhitespaceMessages()`; so it will have functions
 *   `expectedBefore()`, `expectedAfter()`, `rejectedBefore()`, etc.
 * @return {objects} The standardWhitespaceChecker with fun functions to use
 */
export default function (whitespace, whitespaceOptions, whitespaceMessages) {
  return {

    /**
     * Check for whitespace *before* some position in a string.
     *
     * @param {string} source
     * @param {number} index - The index of the character to look before
     *   in `source`
     * @param {function} cb - A callback that accepts a message
     */
    before(source, index, cb) {
      if (whitespaceOptions.ignoreBefore) { return }

      if (whitespaceOptions.expectBefore) {
        // Check for the space 1 character before and no additional
        // whitespace 2 characters before
        if (source[index - 1] === whitespace
          && !/\s/.test(source[index - 2])) { return }
        cb(whitespaceMessages.expectedBefore(source[index]))
      }

      if (whitespaceOptions.rejectBefore) {
        // Check that there's no whitespace at all before
        if (!/\s/.test(source[index - 1])) { return }
        cb(whitespaceMessages.rejectedBefore(source[index]))
      }
    },

    /**
     * Check for whitespace *after* some position in a string.
     *
     * @param {string} source
     * @param {number} index - The index of the character to look after
     *   in `source`
     * @param {function} cb - A callback that accepts a message
     */
    after(source, index, cb) {
      if (whitespaceOptions.ignoreAfter) { return }

      if (whitespaceOptions.expectAfter) {
        // Check for the space 1 character after and no additional
        // whitespace 2 characters after
        if (source[index + 1] === whitespace
          && !/\s/.test(source[index + 2])) { return }
        cb(whitespaceMessages.expectedAfter(source[index]))
      }

      if (whitespaceOptions.rejectAfter) {
        // Check that there's no whitespace at all ater
        if (!/\s/.test(source[index + 1])) { return }
        cb(whitespaceMessages.rejectedAfter(source[index]))
      }
    },
  }
}

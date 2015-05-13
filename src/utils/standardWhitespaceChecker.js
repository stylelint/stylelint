/**
 * Create a standardWhitespaceChecker that exposes `before()` and `after()`
 * functions for checking whitespace around a given point in a string.
 *
 * @param {string} whitespace - The whitespace to look for
 * @param {object} whitespaceOptions - A set of options created by
 *   `standardWhitespaceOptions()`; so it will have `expectBefore`,
 *   `expectAfter`, `rejectBefore`, etc. properties.
 * @param {object} whitespaceMessages
 * @return {[type]}                    [description]
 */
export default function (whitespace, whitespaceOptions, whitespaceMessages) {
  return {
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

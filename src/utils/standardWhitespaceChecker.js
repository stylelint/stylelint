import isWhitespace from "./isWhitespace"

/**
 * Create a standardWhitespaceChecker that exposes `before()` and `after()`
 * functions for checking whitespace around a given point in a string.
 *
 * @param {string} expectedWhitespace - The whitespace to look for
 * @param {object} whitespaceOptions - A set of options created by
 *   `standardWhitespaceOptions()` so it will have properties
 *   `expectBefore`, `expectAfter`, `rejectBefore`, etc.
 * @param {object} whitespaceMessages - A set of messages passed through
 *   `standardWhitespaceMessages()` so it will have functions
 *   `expectedBefore()`, `expectedAfter()`, `rejectedBefore()`, etc.
 * @return {objects} The standardWhitespaceChecker with fun functions to use
 */
export default function (expectedWhitespace, whitespaceOptions, whitespaceMessages) {
  return {

    /**
     * Check for whitespace *before* some position in a string.
     *
     * @param {string} source
     * @param {number} index - The index of the character to look before
     *   in `source`
     * @param {function} err - A callback that accepts a message
     */
    before(source, index, err) {
      if (whitespaceOptions.ignoreBefore) { return }

      const oneCharBefore = source[index - 1]
      const twoCharsBefore = source[index - 2]

      if (whitespaceOptions.expectBefore) {
        // Check for the space 1 character before and no additional
        // whitespace 2 characters before
        if ((isValue(oneCharBefore) && oneCharBefore !== expectedWhitespace)
          || (isValue(twoCharsBefore) && isWhitespace(twoCharsBefore))) {
          err(whitespaceMessages.expectedBefore(source[index]))
        }
      }

      if (whitespaceOptions.rejectBefore) {
        // Check that there's no whitespace at all before
        if (isValue(oneCharBefore) && isWhitespace(oneCharBefore)) {
          err(whitespaceMessages.rejectedBefore(source[index]))
        }
      }
    },

    oneBefore(source, index, err) {
      if (whitespaceOptions.ignoreBefore) { return }

      const oneCharBefore = source[index - 1]

      if (whitespaceOptions.expectBefore) {
        if (isValue(oneCharBefore) && oneCharBefore !== expectedWhitespace) {
          err(whitespaceMessages.expectedBefore(source[index]))
        }
      }

      if (whitespaceOptions.rejectBefore) {
        // Check that there's no whitespace at all before
        if (isValue(oneCharBefore) && isWhitespace(oneCharBefore)) {
          err(whitespaceMessages.rejectedBefore(source[index]))
        }
      }
    },

    /**
     * Check for whitespace *after* some position in a string.
     *
     * @param {string} source
     * @param {number} index - The index of the character to look after
     *   in `source`
     * @param {function} err - A callback that accepts a message
     */
    after(source, index, err) {
      if (whitespaceOptions.ignoreAfter) { return }

      const oneCharAfter = source[index + 1]
      const twoCharsAfter = source[index + 2]

      if (whitespaceOptions.expectAfter) {
        // Check for the space 1 character after and no additional
        // whitespace 2 characters after
        if ((isValue(oneCharAfter) && oneCharAfter !== expectedWhitespace)
          || (isValue(twoCharsAfter) && isWhitespace(twoCharsAfter))) {
          err(whitespaceMessages.expectedAfter(source[index]))
        }
      }

      if (whitespaceOptions.rejectAfter) {
        // Check that there's no whitespace at all ater
        if (isValue(oneCharAfter) && isWhitespace(oneCharAfter)) {
          err(whitespaceMessages.rejectedAfter(source[index]))
        }
      }
    },

    oneAfter(source, index, err) {
      if (whitespaceOptions.ignoreAfter) { return }

      const oneCharAfter = source[index + 1]

      if (whitespaceOptions.expectAfter) {
        if (isValue(oneCharAfter) && oneCharAfter !== expectedWhitespace) {
          err(whitespaceMessages.expectedAfter(source[index]))
        }
      }

      if (whitespaceOptions.rejectAfter) {
        // Check that there's no whitespace at all ater
        if (isValue(oneCharAfter) && isWhitespace(oneCharAfter)) {
          err(whitespaceMessages.rejectedAfter(source[index]))
        }
      }
    },
  }
}

function isValue(x) {
  return x !== undefined && x !== null
}

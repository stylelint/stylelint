const quotes = [ "\"", "'" ]

/**
 * Find the index of a character within a declaration value.
 *
 * @param {object} options
 * @param {string} options.value - The value to look through
 * @param {string} options.char - The character to find
 * @param {boolean} [options.insideFunction] - If `true`, only will report
 *   `char` found inside a function
 * @param {boolean} [options.outsideFunction] - If `true`, only will report
 *   `char` found outside functions
 * @param {boolean} [onlyOne] - Stop looking after the first match is found
 * @param {function} callback - Function that takes the index of `char` or
 *   `undefined` if `char` is not found
 * @return {undefined}
 */
export default function (options, callback) {
  const { value, insideFunction, outsideFunction } = options
  let isInsideString = false
  let isInsideFunction = false
  let openingQuote
  let openingParenCount = 0

  for (let i = 0, l = value.length; i < l; i++) {
    const currentChar = value[i]
    if (!isInsideString && quotes.indexOf(currentChar) !== -1) {
      openingQuote = currentChar
      isInsideString = true
      continue
    }
    if (isInsideString && currentChar === openingQuote) {
      isInsideString = false
      continue
    }
    if (insideFunction || outsideFunction) {
      if (!isInsideString && currentChar === "(") {
        openingParenCount++
        isInsideFunction = true
        continue
      }
      if (!isInsideString && currentChar === ")") {
        openingParenCount--
        if (openingParenCount === 0) {
          isInsideFunction = false
        }
        continue
      }
    }
    // If we have a match,
    // and it is inside or outside of a function, as requested in options,
    // send it to the callback
    if (!isInsideString && currentChar === options.char) {
      if (insideFunction && !isInsideFunction) { continue }
      if (outsideFunction && isInsideFunction) { continue }
      callback(i)
      if (options.onlyOne) { break }
    }
  }
}

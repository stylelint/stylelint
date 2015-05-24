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
  const { value, char, insideFunction, outsideFunction } = options
  let isInsideString = false
  let isInsideFunction = false
  let openingQuote
  let openingParenCount = 0
  let count = 0

  const charToFindIsArray = Array.isArray(char)
  function charMatchesCharToFind(charToCheck) {
    if (charToFindIsArray) {
      return char.indexOf(charToCheck) !== -1
    }
    return charToCheck === char
  }

  for (let i = 0, l = value.length; i < l; i++) {
    const currentChar = value[i]
    if (!isInsideString && quotes.indexOf(currentChar) !== -1) {
      if (value[i - 1] === "\\") { continue }
      openingQuote = currentChar
      isInsideString = true
      continue
    }
    if (isInsideString && currentChar === openingQuote) {
      if (value[i - 1] === "\\") { continue }
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
      if (!isInsideString && /^[a-zA-Z]*\(/.test(value.slice(i))) {
        continue
      }
    }
    // If we have a match,
    // and it is inside or outside of a function, as requested in options,
    // send it to the callback
    if (!isInsideString && charMatchesCharToFind(currentChar)) {
      if (insideFunction && !isInsideFunction) { continue }
      if (outsideFunction && isInsideFunction) { continue }
      count++
      callback(i, count)
      if (options.onlyOne) { return }
    }
  }
}

/**
 * Search within styles.
 *
 * Ignores any matches within CSS strings. Optionally restricts
 * the search to characters within or outside of functional notation.
 *
 * Returns a `match` object with the following properties:
 * - startIndex
 * - endIndex
 * - target
 *
 * @param {object} options
 * @param {string} options.source - The source to search through
 * @param {string|string[]} options.target - The target of the search. Can be
 *   - a single character,
 *   - a string with some length,
 *   - an array of strings, all of which count as matches
 * @param {boolean} [options.withinFunctionalNotation] - If `true`, only will report
 *   matches found inside a function
 * @param {boolean} [options.outsideFunctionalNotation] - If `true`, only will report
 *   matches found outside functions
 * @param {boolean} [onlyOne] - Stop looking after the first match is found
 * @param {function} callback - Function that takes the index of a match as its
 *   argument
 */
export default function (options, callback) {
  const {
    source,
    target,
    withinFunctionalNotation,
    outsideFunctionalNotation
  } = options

  const targetIsArray = Array.isArray(target)

  const checkAgainstTarget = (() => {
    if (!targetIsArray) {
      return checkChar.bind(null, target)
    }
    return (index) => {
      for (let ti = 0, tl = target.length; ti < tl; ti++) {
        const checkResult = checkChar(target[ti], index)
        if (checkResult) { return checkResult }
      }
      return false
    }
  }())

  function checkChar(targetString, index) {
    const targetStringLength = targetString.length

    // Target is a single character
    if (targetStringLength === 1 && source[index] !== targetString) {
      return false
    }

    // Target is multiple characters
    if (source.substr(index, targetStringLength) !== targetString) {
      return false
    }

    return {
      startIndex: index,
      endIndex: index + targetStringLength,
      target: targetString,
    }
  }

  let insideString = false
  let insideFunction = false
  let openingQuote
  let openingParenCount = 0
  let matchCount = 0

  for (let i = 0, l = source.length; i < l; i++) {

    const currentChar = source[i]

    // Register the beginning of a string
    if (!insideString && (currentChar === "\"" || currentChar === "'")) {
      // Ignore escaped quote
      if (source[i - 1] === "\\") { continue }

      openingQuote = currentChar
      insideString = true

      // For string-quotes rule
      if (target === currentChar) {
        matchFound(checkAgainstTarget(i))
      }
      continue
    }

    if (insideString) {

      // Register the end of a string
      if (currentChar === openingQuote) {
        // Ignore escaped quote
        if (source[i - 1] === "\\") { continue }
        insideString = false
        continue
      }

      // If we are inside a string and it is not ending,
      // we should ignore the current char
      continue
    }

    // If we are paying attention to functions ...
    if (withinFunctionalNotation || outsideFunctionalNotation) {

      // Register the beginning of a function
      if (currentChar === "(") {
        // Keep track of opening parentheses so that we
        // know when the outermost function (possibly
        // containing nested functions) is closing
        openingParenCount++
        insideFunction = true
        continue
      }

      // Register the end of a function
      if (currentChar === ")") {
        openingParenCount--
        if (openingParenCount === 0) {
          insideFunction = false
        }
        continue
      }

      // If this char is part of a function name, ignore it
      if (/^[a-zA-Z]*\(/.test(source.slice(i))) {
        continue
      }
    }

    const match = checkAgainstTarget(i)

    if (!match) { continue }

    // If we have a match,
    // and it is inside or outside of a function, as requested in options,
    // send it to the callback
    if (withinFunctionalNotation && !insideFunction) { continue }
    if (outsideFunctionalNotation && insideFunction) { continue }
    matchFound(match)
    if (options.onlyOne) { return }
  }

  function matchFound(match) {
    matchCount++
    callback(match, matchCount)
  }
}

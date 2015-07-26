/**
 * Search within CSS strings for some character(s),
 * and for every match found invoke a callback,
 * passing it a `match` object with the following properties:
 * - startIndex: where the match begins
 * - endIndex: where the match ends
 * - target: what got matched
 *
 * Always ignores CSS strings (e.g. `content` property values).
 * By default ignores comments.
 * Optionally restricts the search to characters within or outside of functional notation.
 *
 * @param {object} options
 * @param {string} options.source - The source string to search through
 * @param {string|string[]} options.target - The target of the search. Can be
 *   - a single character,
 *   - a string with some length,
 *   - an array of strings, all of which count as matches
 *     (the `match` object passed to the `callback` will differentiate which string of
 *     the array got matched via its `target` property)
 * @param {boolean} [options.withinFunctionalNotation] - If `true`, only report
 *   matches found *inside* CSS functions
 * @param {boolean} [options.outsideFunctionalNotation] - If `true`, only report
 *   matches found *outside* CSS functions
 * @param {boolean} [options.checkComments] - If `true`, comments will *not* be ignored
 * @param {boolean} [options.onlyOne] - Stop looking after the first match is found
 * @param {function} callback - Is invoked for every match, receiving the `match` object
 *   and a count of how many matches have been found up to that point
 */
export default function (options, callback) {
  const {
    source,
    target,
  } = options

  const targetIsArray = Array.isArray(target)

  // If the target is just a string, it is easy to check whether
  // some index of the source matches it.
  // If the target is an array of strings, though, we have to
  // check whether some index of the source mathces *any* of
  // those target strings (stopping after the first match).
  const checkAgainstTarget = (function () {
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
  let insideComment = false
  let insideFunction = false
  let openingParenCount = 0
  let matchCount = 0
  let openingQuote

  for (let i = 0, l = source.length; i < l; i++) {

    const currentChar = source[i]

    // Register the beginning of a comment
    if (!options.checkComments) {
      if (
        !insideComment
        && currentChar === "/"
        && source[i - 1] !== "\\" // escaping
        && source[i + 1] === "*"
      ) {
        insideComment = true
        continue
      }

      if (insideComment) {
        // Register the end of a comment
        if (
          currentChar === "*"
          && source[i - 1] !== "\\" // escaping
          && source[i + 1] === "/"
        ) {
          insideComment = false
          continue
        }
        // Or just keep going, because we're
        // still inside a comment
        continue
      }
    }

    // Register the beginning of a string
    if (!insideString && (currentChar === "\"" || currentChar === "'")) {
      if (source[i - 1] === "\\") { continue } // escaping

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
        if (source[i - 1] === "\\") { continue } // escaping
        insideString = false
        continue
      }
      // If we are inside a string and it is not ending,
      // we should ignore the current char
      continue
    }

    // If we are paying attention to functions ...
    if (options.withinFunctionalNotation || options.outsideFunctionalNotation) {

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
    if (options.withinFunctionalNotation && !insideFunction) { continue }
    if (options.outsideFunctionalNotation && insideFunction) { continue }
    matchFound(match)
    if (options.onlyOne) { return }
  }

  function matchFound(match) {
    matchCount++
    callback(match, matchCount)
  }
}

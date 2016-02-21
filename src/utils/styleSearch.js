/**
 * Search within CSS strings for some character(s),
 * and for every match found invoke a callback,
 * passing it a `match` object with the following properties:
 * - startIndex: where the match begins
 * - endIndex: where the match ends
 * - target: what got matched
 * - insideFunction: whether the match is inside a function
 * - insideComment: whether the match is inside a comment
 * - insideString: whether the match is inside a string
 *
 * By default ignores strings, comments, and function names.
 * Optionally restricts the search to characters within or outside of functional notation.
 *
 * @param {object} options
 * @param {string} options.source - The source string to search through
 * @param {string|string[]} options.target - The target of the search. Can be
 *   - a single character
 *   - a string with some length
 *   - an array of strings, all of which count as matches
 *     (the `match` object passed to the `callback` will differentiate which string of
 *     the array got matched via its `target` property)
 * @param {boolean} [options.withinFunctionalNotation] - If `true`, only report
 *   matches found *inside* CSS functions
 * @param {boolean} [options.outsideFunctionalNotation] - If `true`, only report
 *   matches found *outside* CSS functions
 * @param {boolean} [options.withinStrings] - If `true`, only report
 *   matches found *inside* CSS strings
 * @param {boolean} [options.withinComments] - If `true`, only report
 *   matches found *inside* CSS comments
 * @param {boolean} [options.checkComments] - If `true`, comments will *not* be ignored
 * @param {boolean} [options.checkStrings] - If `true`, strings will *not* be ignored
 * @param {boolean} [options.checkFunctionNames] - If `true`, function names will *not* be ignored
 * @param {boolean} [options.onlyOne] - Stop looking after the first match is found
 * @param {function} callback - Invoked for every match, receiving the `match` object
 *   and a count of how many matches have been found up to that point
 */
export default function (options, callback) {
  const {
    source,
    target,
  } = options

  let insideString = false
  let insideComment = false
  let insideSingleLineComment = false
  let insideFunction = false
  let openingParenCount = 0
  let matchCount = 0
  let openingQuote

  const ignoreStrings = !options.checkStrings && !options.withinStrings
  const ignoreComments = !options.checkComments && !options.withinComments

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
      insideFunction,
      insideComment,
      insideString,
      startIndex: index,
      endIndex: index + targetStringLength,
      target: targetString,
    }
  }

  for (let i = 0, l = source.length; i < l; i++) {

    const currentChar = source[i]

    // Register the beginning of a comment
    if (
      !insideComment
      && currentChar === "/"
      && source[i - 1] !== "\\" // escaping
    ) {
      if (source[i + 1] === "*") {
        insideComment = true
        continue
      }
      // single-line
      if (source[i + 1] === "/") {
        insideComment = true
        insideSingleLineComment = true
        continue
      }
    }

    // Register the end of a (standard) comment
    if (
      insideComment && !insideSingleLineComment
      && currentChar === "*"
      && source[i - 1] !== "\\" // escaping
      && source[i + 1] === "/"
    ) {
      insideComment = false
      continue
    }

    // Register the end of a single-line comment
    if (
      insideComment && insideSingleLineComment
      && currentChar === "\n"
    ) {
      insideComment = false
      insideSingleLineComment = false
    }

    if (insideComment && ignoreComments) { continue }

    // Register the beginning of a string
    if (!insideString && (currentChar === "\"" || currentChar === "'")) {
      if (source[i - 1] === "\\") { continue } // escaping

      openingQuote = currentChar
      insideString = true

      // For string-quotes rule
      if (target === currentChar) { matchFound(checkAgainstTarget(i)) }
      continue
    }

    if (insideString) {
      // Register the end of a string
      if (currentChar === openingQuote) {
        if (source[i - 1] === "\\") { continue } // escaping
        insideString = false
        continue
      }
    }

    if (insideString && ignoreStrings) { continue }

    // Register the beginning of a function
    if (currentChar === "(") {
      // Keep track of opening parentheses so that we
      // know when the outermost function (possibly
      // containing nested functions) is closing
      openingParenCount++
      insideFunction = true
      if (target === "(") { matchFound(checkAgainstTarget(i)) }
      continue
    }

    // Register the end of a function
    if (currentChar === ")") {
      openingParenCount--
      if (openingParenCount === 0) {
        insideFunction = false
      }
      if (target === ")") { matchFound(checkAgainstTarget(i)) }
      continue
    }

    // If this char is part of a function name, ignore it
    if (!options.checkFunctionNames && /^[a-zA-Z]*\(/.test(source.slice(i))) {
      continue
    }

    const match = checkAgainstTarget(i)

    if (!match) { continue }

    if (options.withinFunctionalNotation && !insideFunction) { continue }
    if (options.outsideFunctionalNotation && insideFunction) { continue }
    if (options.withinStrings && !insideString) { continue }
    if (options.withinComments && !insideComment) { continue }
    matchFound(match)
    if (options.onlyOne) { return }
  }

  function matchFound(match) {
    matchCount++
    callback(match, matchCount)
  }
}

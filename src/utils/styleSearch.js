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
 * @param {boolean} [options.outsideParens] - If `true`, only report
 *   matches found *outside* of *any* parentheses (including functions but also Sass maps etc.)
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
  let insideParens = false
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
  // check whether some index of the source matches *any* of
  // those target strings (stopping after the first match).
  const getMatch = (function () {
    if (!targetIsArray) {
      return getMatchBase.bind(null, target)
    }
    return (index) => {
      for (let ti = 0, tl = target.length; ti < tl; ti++) {
        const checkResult = getMatchBase(target[ti], index)
        if (checkResult) { return checkResult }
      }
      return false
    }
  }())

  function getMatchBase(targetString, index) {
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
      insideParens,
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
      !insideString && !insideComment
      && currentChar === "/"
      && source[i - 1] !== "\\" // escaping
    ) {
      // standard comments
      if (source[i + 1] === "*") {
        insideComment = true
        continue
      }
      // single-line comments
      if (source[i + 1] === "/") {
        insideComment = true
        insideSingleLineComment = true
        continue
      }
    }

    if (insideComment) {
      // Register the end of a standard comment
      if (
        !insideSingleLineComment
        && currentChar === "*"
        && source[i - 1] !== "\\" // escaping
        && source[i + 1] === "/"
        && source[i - 1] !== "/" // don't end if it's /*/
      ) {
        insideComment = false
        continue
      }

      // Register the end of a single-line comment
      if (
        insideSingleLineComment
        && currentChar === "\n"
      ) {
        insideComment = false
        insideSingleLineComment = false
      }

      if (ignoreComments) { continue }
    }

    // Register the beginning of a string
    if (!insideComment && !insideString && (currentChar === "\"" || currentChar === "'")) {
      if (source[i - 1] === "\\") { continue } // escaping

      openingQuote = currentChar
      insideString = true

      // For string-quotes rule
      if (target === currentChar) { handleMatch(getMatch(i)) }
      continue
    }

    if (insideString) {
      // Register the end of a string
      if (currentChar === openingQuote) {
        if (source[i - 1] === "\\") { continue } // escaping
        insideString = false
        continue
      }

      if (ignoreStrings) { continue }
    }

    // Register the beginning of parens/functions
    if (!insideString && !insideComment && currentChar === "(") {
      // Keep track of opening parentheses so that we
      // know when the outermost function (possibly
      // containing nested functions) is closing
      openingParenCount++

      insideParens = true
      // Only inside a function if there is a function name
      // before the opening paren
      if (/[a-zA-Z]/.test(source[i - 1])) {
        insideFunction = true
      }

      if (target === "(") { handleMatch(getMatch(i)) }
      continue
    }

    if (insideParens) {
      // Register the end of a function
      if (currentChar === ")") {
        openingParenCount--
        // Do this here so it's still technically inside a function
        if (target === ")") { handleMatch(getMatch(i)) }
        if (openingParenCount === 0) {
          insideParens = false
          insideFunction = false
        }
        continue
      }
    }

    // If this char is part of a function name, ignore it
    if (!options.checkFunctionNames && /^[a-zA-Z]*\(/.test(source.slice(i))) {
      continue
    }

    const match = getMatch(i)

    if (!match) { continue }
    handleMatch(match)
    if (options.onlyOne) { return }
  }

  function handleMatch(match) {
    if (options.outsideParens && insideParens) { return }
    if (options.withinFunctionalNotation && !insideFunction) { return }
    if (options.outsideFunctionalNotation && insideFunction) { return }
    if (options.withinStrings && !insideString) { return }
    if (options.withinComments && !insideComment) { return }
    matchCount++
    callback(match, matchCount)
  }
}

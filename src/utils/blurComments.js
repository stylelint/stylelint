/**
 * Replace all comments with some innocuous character.
 *
 * @param {string} source
 * @param {[string]} blurChar="`"
 * @return {string} - The result string, with comments replaced
 */
export default function (source, blurChar = "`") {
  return source.replace(/\/\*.*\*\//g, blurChar)
}

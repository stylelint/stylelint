/**
 * Replace all of the characters that are interpolation with some innocuous character.
 *
 * For example:
 * blurFunctionArguments("abc url(abc) abc", "url") === "abc url(```) abc"
 *
 * @param {string} source
 * @return {string} - The result string, with the interpolation characters "blurred"
 */
export default function (source, blurChar = " ") {
  return source.replace(/[#@{}]+/g, blurChar)
}

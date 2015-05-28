import balanacedMatch from "balanced-match"
import styleSearch from "./styleSearch"

/**
 * Search for functions by name. For every match,
 * invoke the callback, passing the functions
 * "argument(s) string" (whatever is inside the parentheses)
 * as an argument.
 *
 * @param {string} source
 * @param {string} functionName - e.g. calc, color, rgba
 * @param {function} callback - Will be called once for every
 *   matching function found, with the function's "argument(s) string"
 *   as the argument
 */
export default function (source, functionName, callback) {
  styleSearch({ source, target: functionName }, index => {
    if (source[index + functionName.length] !== "(") { return }
    const parensMatch = balanacedMatch("(", ")", source.substr(index))
    callback(parensMatch.body)
  })
}

import matchesStringOrRegExp from "./matchesStringOrRegExp"

/**
 * Check if an options object contains a user-defined string or regex that
 * matches the passed in Node.
 *
 * @param {object} options
 * @param {Node} postcss-selector-parser node
 * @return {boolean} If `true`, a match was found
 */
export default function optionsHaveIgnoredType(options, typeNode) {
  return !!(
    options &&
    options.ignoreTypes &&
    matchesStringOrRegExp(typeNode.value.toLowerCase(), options.ignoreTypes)
  )
}

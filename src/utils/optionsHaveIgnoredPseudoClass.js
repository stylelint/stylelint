import matchesStringOrRegExp from "./matchesStringOrRegExp"

/**
 * Check if an options object contains a user-defined string or regex that
 * matches the passed in Node.
 *
 * @param {object} options
 * @param {Node} postcss-selector-parser node
 * @return {boolean} If `true`, a match was found
 */
export default function optionsHaveIgnoredPseudoClass(options, pseudoClassNode) {
  return !!(
    options &&
    options.ignorePseudoClasses &&
    matchesStringOrRegExp(pseudoClassNode.value.slice(1).toLowerCase(), options.ignorePseudoClasses)
  )
}

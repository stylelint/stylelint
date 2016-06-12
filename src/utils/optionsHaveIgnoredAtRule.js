import matchesStringOrRegExp from "./matchesStringOrRegExp"

/**
 * Check if an options object contains a certain `ignoreAtRules` keyword.
 * It will look for an `ignoreAtRules` property whose value should
 * be an array of keywords.
 *
 * @param {object} options
 * @param {AtRule} atRule - postcss at-rule node
 * @return {boolean}
 */
export default function optionsHaveIgnoredAtRule(options, atRule) {
  return (
    options &&
    options.ignoreAtRules &&
    atRule.type === "atrule" &&
    matchesStringOrRegExp(atRule.name, options.ignoreAtRules)
  )
}

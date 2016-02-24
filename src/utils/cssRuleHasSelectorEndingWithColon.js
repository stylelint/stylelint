import { get } from "lodash"

/**
 * Check whether a rule has a selector ending in a colon
 *
 * @param {Rule} postcss rule node
 * @return {boolean} If `true`, the rule has a selector ending in a colon
 */
export default function (rule) {
  const selector = get(rule, "raws.selector.raw", rule.selector)
  if (selector[selector.length - 1] === ":") { return true }
  return false
}

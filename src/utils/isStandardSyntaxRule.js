import _ from "lodash"

/**
 * Check whether a rule is standard
 *
 * @param {Rule} postcss rule node
 * @return {boolean} If `true`, the rule is standard
 */
export default function (rule) {

  // Get full selector
  const selector = _.get(rule, "raws.selector.raw", rule.selector)

  // Custom property set (e.g. --custom-property-set: {})
  if (_.endsWith(selector, ":")) { return false }

  // Called Less mixin (e.g. a { .mixin() })
  if (rule.ruleWithoutBody) { return false }

  // Ignore mixin or &:extend rule
  // https://github.com/webschik/postcss-less/blob/master/lib/less-parser.js#L52
  if (rule.params && rule.params[0]) { return false }

  // Non-outputting Less mixin definition (e.g. .mixin() {})
  if (_.endsWith(selector, ")") && !_.includes(selector, ":")) { return false }

  return true
}

/* @flow */
/**
 * Given a CSS statement, return the string before the block.
 * For rules, this is the selector list (and surrounding whitespace).
 * For at-rules, this is the name and params (and surrounding whitespace).
 *
 * If there is no block, return empty string.
 *
 * @param {Rule|AtRule} statement - postcss rule or at-rule node
 * @param {object} options
 * @param {boolean} [options.noRawBefore] - Leave out the `before` string
 * @return {string}
 */
export default function (
  statement: Object,
  { noRawBefore }: { noRawBefore: ?boolean} = {}
): string {
  let result: string = ""
  let rule: postcss$rule
  let atRule: postcss$atRule

  if (statement.type === "rule") { rule = statement }
  if (statement.type === "atrule") { atRule = statement }

  if (!rule && !atRule) { return result }

  const before: string = statement.raws.before
  const between: string = statement.raws.between

  if (!noRawBefore) { result += before }
  if (rule) { result += rule.selector }
  if (atRule) { result += "@" + atRule.name + atRule.raws.afterName + atRule.params }
  if (between !== undefined) { result += between }

  return result
}

import cssStatementHasBlock from "./cssStatementHasBlock"

/**
 * Given a CSS statement, return the string before the block.
 * For rules, this is the selector list (and surrounding whitespace).
 * For at-rules, this is the name and params (and surrounding whitespace).
 *
 * If there is no block, return undefined.
 *
 * @param {Rule|AtRule} statement - postcss rule or at-rule node
 * @param {object} options
 * @param {boolean} [options.noBefore] - Leave out the `before` string
 * @return {string|undefined}
 */
export default function (statement, { noBefore }={}) {
  if (!cssStatementHasBlock(statement)) { return }

  let result = ""
  if (!noBefore) {
    result += statement.raws.before
  }
  if (statement.type === "rule") {
    result += statement.selector
  } else {
    result += "@" + statement.name + statement.raws.afterName + statement.params
  }
  result += statement.raws.between
  return result
}

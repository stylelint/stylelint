import cssStatementHasBlock from "./cssStatementHasBlock"

/**
 * Given a CSS statement, return the string before the block.
 * For rules, this is the selector list (and surrounding whitespace).
 * For at-rules, this is the name and params (and surrounding whitespace).
 *
 * If there is no block, return undefined.
 *
 * @param {Rule|AtRule} statement - postcss rule or at-rule node
 * @return {string|undefined}
 */
export default function (statement) {
  if (!cssStatementHasBlock(statement)) { return }

  return (statement.type === "rule")
    ? statement.before + statement.selector + statement.between
    : statement.before + "@" + statement.name + statement.afterName +
      statement.params + statement.between
}

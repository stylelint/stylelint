import hasBlock from "./hasBlock"

/**
 * Given a statement, return the string before the block.
 *
 * If there is no block, return undefined.
 *
 * @param {PostCSSAtRule|PostCSSRule} statement
 * @return {string|undefined}
 */
export default function (statement) {
  if (!hasBlock(statement)) { return }

  return (statement.type === "rule")
    ? statement.before + statement.selector + statement.between
    : statement.before + "@" + statement.name + statement.afterName +
      statement.params + statement.between
}

/**
 * Check if a statement is a nesting block
 *
 * @param {Rule|AtRule} statement - postcss rule or at-rule node
 * @return {boolean} True if `statement` is a nesting block
 */
export default function (statement) {
  return (
    statement.type === "rule" && statement.selector === ""
  )
}

/**
 * Check if a statement has an empty block.
 *
 * @param {Rule|AtRule} statement - postcss rule or at-rule node
 * @return {boolean} True if the statement has a block and it is empty
 */
export default function (statement) {
  return (
    statement.nodes !== undefined // has block
    && statement.nodes.length === 0 // and is empty
  )
}

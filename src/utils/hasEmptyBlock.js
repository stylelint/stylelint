/**
 * Check if a statement has an empty block
 *
 * @param {object} statement - A rule or at-rule postcss node
 * @return {boolean} true is has a block and is empty
 */
export default function (statment) {
  return (
    statment.nodes !== undefined // has block
    && statment.nodes.length === 0 // and is empty
  )
}

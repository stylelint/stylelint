/**
 * Check if a statement has an block (empty or otherwise)
 *
 * @param {object} statement - A rule or at-rule postcss node
 * @return {boolean} true is has a block (empty or otherwise)
 */
export default function (statment) {
  return (
    statment.nodes !== undefined
  )
}

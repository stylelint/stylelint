/**
 * Get the next non-comment node in a PostCSS AST
 * at or after a given node.
 *
 * @param {Node} node
 * @return {undefined|Node} The next non-comment node,
 *   or `null` if that doesn't not exist.
 */
export default function nextNonCommentNode(startNode) {
  if (!startNode || !startNode.next) return null

  if (startNode.type === "comment") {
    return nextNonCommentNode(startNode.next())
  }

  return startNode
}

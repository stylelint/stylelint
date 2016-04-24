/**
 * Check whether a type selector is standard
 *
 * @param {Node} postcss-selector-parser node (of type tag)
 * @return {boolean} If `true`, the type selector is standard
 */
export default function (node) {

  // postcss-selector-parser includes the arguments to nth-child() functions
  // as "tags", so we need to ignore them ourselves.
  // The fake-tag's "parent" is actually a selector node, whose parent
  // should be the :nth-child pseudo node.
  if (
    node.parent.parent.type === "pseudo" &&
    node.parent.parent.value === ":nth-child"
  ) {
    return false
  }

  // & is not a type selector: it's used for nesting
  if (node.value[0] === "&") { return false }

  return true
}

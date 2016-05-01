/**
 * Check whether a declaration is standard
 *
 * @param {Decl} postcss declaration node
 * @return {boolean} If `true`, the declaration is standard
 */
export default function (decl) {

  // Declarations belong in a declaration block
  if (decl.parent.type === "root") { return false }

  return true
}

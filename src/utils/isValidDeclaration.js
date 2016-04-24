/**
 * Check whether a declaration is valid
 *
 * @param {Decl} postcss declaration node
 * @return {boolean} If `true`, the declartion is valid
 */
export default function (decl) {
  const { prop } = decl

  // SCSS var, list or map
  if (prop[0] === "$") { return false }
  return true
}

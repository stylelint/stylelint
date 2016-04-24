/**
 * Check whether a declaration is valid
 *
 * @param {Decl} postcss declaration node
 * @return {boolean} If `true`, the declaration is valid
 */
export default function (decl) {
  const { prop } = decl

  // SCSS var (e.g. $var: x), list (e.g. $list: (x)) or map (e.g. $map: (key:value))
  if (prop[0] === "$") { return false }
  return true
}

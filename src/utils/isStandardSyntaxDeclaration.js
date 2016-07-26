/**
 * Check whether a declaration is standard
 *
 * @param {Decl} postcss declaration node
 * @return {boolean} If `true`, the declaration is standard
 */
export default function (decl) {

  const { prop } = decl

  // Declarations belong in a declaration block
  if (decl.parent.type === "root") { return false }

  // SCSS var (e.g. $var: x), nested list (e.g. $list: (x)) or nested map (e.g. $map: (key:value))
  if (prop[0] === "$") { return false }

  // Less var (e.g. @var: x), but exclude variable interpolation (e.g. @{var})
  if (prop[0] === "@" && prop[1] !== "{") { return false }

  return true
}

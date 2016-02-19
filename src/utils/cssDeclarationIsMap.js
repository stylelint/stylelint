/**
 * Check whether a declaration is a scss map
 *
 * @param {Decl} postcss declaration node
 * @return {boolean} If `true`, the declartion is a scss map
 */
export default function (decl) {
  const { prop, value } = decl
  if (prop[0] === "$" &&
    value[0] === "(" &&
    value[value.length -1] === ")" &&
    value.indexOf(":") !== -1) { return true }
  return false
}

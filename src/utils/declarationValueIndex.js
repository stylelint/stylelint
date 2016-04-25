/**
 * Get the index of a declaration's value
 *
 * @param {Decl} decl
 * @return {int} The index
 */
export default function (decl) {
  const beforeColon = decl.toString().indexOf(":")
  const afterColon = decl.raw("between").length - decl.raw("between").indexOf(":")
  return beforeColon + afterColon
}

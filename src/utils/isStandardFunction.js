/**
 * Check whether a function is standard
 *
 * @param {Node} postcss-value-parser node (of type function)
 * @return {boolean} If `true`, the function is standard
 */
export default function (node) {

  // Function nodes without names are things in parentheses like Sass lists
  if (!node.value) { return false }

  return true
}

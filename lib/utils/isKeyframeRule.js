"use strict"

/**
 * Check if a rule is a keyframe one
 *
 * @param {Rule} rule - postcss rule node
 * @return {boolean} If `true`, the rule is a keyframe one
 */
module.exports = function (rule) {
  const parent = rule.parent

  return parent.type === "atrule" && parent.name.toLowerCase() === "keyframes"
}

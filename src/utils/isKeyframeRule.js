/**
 * Check if a rule is a keyframe one
 *
 * @param {Rule} rule - postcss rule node
 * @return {boolean} If `true`, the rule is a keyframe one
 */
export default function (rule) {
  const { parent } = rule
  return (
    parent.type === "atrule"
    && parent.name.toLowerCase() === "keyframes"
  )
}

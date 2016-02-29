/**
 * Find the @media query in which a rule is nested.
 *
 * Returns `null` if the rule is not nested within a media query.
 *
 * @param {Rule} rule
 * @return {AtRule|null}
 */
export default function findMediaContext(rule) {
  const { parent } = rule
  if (parent.type === "root") { return null }
  if (parent.type === "atrule" && parent.name === "media") {
    return parent
  }
  return findMediaContext(parent)
}

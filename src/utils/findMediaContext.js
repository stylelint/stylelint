export default function findMediaContext(rule) {
  const { parent } = rule
  if (parent.type === "root") { return null }
  if (parent.type === "atrule" && parent.name === "media") {
    return parent
  }
  return findMediaContext(parent)
}

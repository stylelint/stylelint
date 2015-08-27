export default function (node) {
  var result = ""
  if (node.raws && node.raws.before) {
    result += node.raws.before
  }
  result += node.toString()
  return result
}

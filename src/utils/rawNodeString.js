export default function (node) {
  var result = ""
  if (node.raw("before")) {
    result += node.raw("before")
  }
  result += node.toString()
  return result
}

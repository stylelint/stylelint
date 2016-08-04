import methodTransforms from "./transformConsts.js"

export default (fileInfo, api) => {
  const j = api.jscodeshift
  const root = j(fileInfo.source)
  const optionsMethodCalls = root
  .find(j.CallExpression)
  .filter(nodePath => {
    // filter to approved method names
    const { node } = nodePath
    const methodNames = methodTransforms.map(method => method.methodName)
    return !!(
      node.callee &&
      node.callee.name &&
      methodNames.indexOf(node.callee.name) > -1
    )
  })
  .replaceWith(nodePath => {
    const { node } = nodePath

    const transform = methodTransforms.filter(o => {
      return o.methodName === node.callee.name
    })[0]

    const propertyName = j.literal(transform.haystackKey)

    let value = node.arguments[1]

    if (transform.needleKey !== false) {
      value = j.memberExpression(
        j.identifier(node.arguments[1].name),
        j.identifier(transform.needleKey)
      )
    }

    node.callee.name = transform.newMethodName
    node.arguments[1] = propertyName
    node.arguments[2] = value
    return node
  })
  .toSource()

  return optionsMethodCalls
}

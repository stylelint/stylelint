import methodTransforms from "./transformConsts.js"

export default (fileInfo, api) => {
  const j = api.jscodeshift
  const root = j(fileInfo.source)
  const optionsImportNode = root
  .find(j.ImportSpecifier)
  .filter(nodePath => {
    const { node } = nodePath
    const methodNames = methodTransforms.map(method => method.methodName)
    return !!(
      node.local &&
      node.local.name &&
      methodNames.indexOf(node.local.name) > -1
    )
  })
  .replaceWith(nodePath => {
    const { node } = nodePath
    const transform = methodTransforms.filter(o => {
      return o.methodName === node.local.name
    })[0]
    node.imported.name = transform.newMethodName
    node.local.name = transform.newMethodName

    return node
  })
  .toSource()

  return optionsImportNode
}

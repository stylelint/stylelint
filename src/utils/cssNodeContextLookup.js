export default function () {
  const contextMap = new Map()

  return {
    getContext(node, ...subContexts) {
      const nodeSource = node.source.input.from
      const baseContext = creativeGetMap(contextMap, nodeSource)
      return subContexts.reduce((result, context) => {
        return creativeGetMap(result, context)
      }, baseContext)
    },
  }
}

function creativeGetMap(someMap, someThing) {
  if (!someMap.has(someThing)) {
    someMap.set(someThing, new Map())
  }
  return someMap.get(someThing)
}

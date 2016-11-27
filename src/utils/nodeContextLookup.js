/**
 * Create a collection of Maps that serve to contextualize a given node.
 * This is useful to ensure that you only compare nodes that share a certain
 * context.
 *
 * All nodes are initially contextualized by their input source.
 * From there, you can contextualize them however you want.
 *
 * For a usage example, see `selector-no-descending-specificity`.
 */
export default function () {
  const contextMap = new Map()

  return {
    getContext(node) {
      const nodeSource = node.source.input.from
      const baseContext = creativeGetMap(contextMap, nodeSource)

      for (var _len = arguments.length, subContexts = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        subContexts[_key - 1] = arguments[_key]
      }

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

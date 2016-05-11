import selectorParser from "postcss-selector-parser"

export default function (selector, result, node, cb) {
  try {
    selectorParser(cb).process(selector)
  } catch (e) {
    result.warn("Cannot parse selector", { node })
  }
}

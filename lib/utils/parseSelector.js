"use strict"

const selectorParser = require("postcss-selector-parser")

module.exports = function (selector, result, node, cb) {
  try {
    selectorParser(cb).process(selector)
  } catch (e) {
    result.warn("Cannot parse selector", { node })
  }
}

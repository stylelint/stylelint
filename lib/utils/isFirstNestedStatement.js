/* @flow */
"use strict"

module.exports = function (statement/*: postcss$rule | postcss$atRule*/)/*: boolean*/ {
  if (statement.type !== "rule" && statement.type !== "atrule") {
    return false
  }

  const parentNode = statement.parent

  return parentNode !== undefined
    && parentNode.type !== "root"
    && statement === parentNode.first
}

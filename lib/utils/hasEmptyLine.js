/* @flow */
"use strict"

/**
 * Check if a string contains at least one empty line
 */
module.exports = function (string/*:: ?: string*/)/*: boolean*/ {
  if (string === "" || string === undefined) return false
  return string.indexOf("\n\n") !== -1 || string.indexOf("\n\r\n") !== -1
}

/* @flow */
"use strict"

const keywordSets = require("../reference/keywordSets")
const _ = require("lodash")

/**
 * Check value is a custom ident
 */

module.exports = function (value/*: string*/)/*: boolean*/ {
  const valueLowerCase = value.toLowerCase()

  if (keywordSets.counterIncrementKeywords.has(valueLowerCase) || _.isFinite(parseInt(valueLowerCase))) {
    return false
  }

  return true
}

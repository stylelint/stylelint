/* @flow */
"use strict"

const svgTags = require("svg-tags")
const htmlTags = require("html-tags")
const keywordSets = require("../reference/keywordSets")
const mathMLTags = require("mathml-tag-names")

/**
 * Check whether a type selector is a custom element
 */
module.exports = function (selector/*: string*/)/*: boolean*/ {
  if (!(/^[a-z]/).test(selector)) {
    return false
  }

  if (selector.indexOf("-") === -1) {
    return false
  }

  const selectorLowerCase = selector.toLowerCase()

  if (selectorLowerCase !== selector) {
    return false
  }
  if (svgTags.indexOf(selectorLowerCase) !== -1) {
    return false
  }
  if (htmlTags.indexOf(selectorLowerCase) !== -1) {
    return false
  }
  if (keywordSets.nonStandardHtmlTags.has(selectorLowerCase)) {
    return false
  }
  if (mathMLTags.indexOf(selectorLowerCase) !== -1) {
    return false
  }

  return true
}

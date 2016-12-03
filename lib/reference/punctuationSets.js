"use strict"

const punctuationSets = {}

punctuationSets.mediaFeaturePunctuation = new Set([
  ":",
  "=",
  ">",
  ">=",
  "<",
  "<=",
])

punctuationSets.nonSpaceCombinators = new Set([
  ">",
  "+",
  "~",
])

module.exports = punctuationSets

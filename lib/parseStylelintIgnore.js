/* @flow */
"use strict"

function parseStylelintIgnore(text/*:: ?: string */)/*: Array<string>*/ {
  if (!text) return []
  return text.split(/\r?\n/).filter(line => {
    if (line === "") return false
    if (/^#/.test(line)) return false
    return true
  })
}

module.exports = parseStylelintIgnore

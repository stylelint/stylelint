"use strict"

module.exports = function createEmptyLines(lineBreaksCount) {
  return new Array(lineBreaksCount + 1).join("\n")
}

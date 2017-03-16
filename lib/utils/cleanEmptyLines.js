"use strict"

module.exports = function cleanEmptyLines(input) {
  return input.replace(/\r\n\s*\r\n/g, "\r\n").replace(/\n\s*\n/g, "\n")
}

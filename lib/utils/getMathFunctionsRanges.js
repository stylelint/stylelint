"use strict";

const MATH_FUNCTIONS = ["calc"];
const MATH_FUNCTIONS_REGEXP = new RegExp(
  `(?:${MATH_FUNCTIONS.join("|")})` + "\\([^()]*(?:\\(.*\\))*[^()]*\\)",
  "gi"
);

module.exports = function getMathFunctionsRanges(valueString) {
  const result = [];
  let current;

  while ((current = MATH_FUNCTIONS_REGEXP.exec(valueString)) !== null) {
    result.push([current.index, current.index + current[0].length]);
  }

  return result;
};

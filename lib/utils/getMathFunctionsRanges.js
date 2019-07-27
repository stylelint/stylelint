"use strict";

const MATH_REGEXP = /calc\([^()]*(?:\(.*\))*[^()]*\)/gi;

module.exports = function getMathFunctionsRanges(valueString) {
  const result = [];
  let current;

  while ((current = MATH_REGEXP.exec(valueString)) !== null) {
    result.push([current.index, current.index + current[0].length]);
  }

  return result;
};

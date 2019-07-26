"use strict";

module.exports = function isMathFunction(valueString) {
  return /calc\((.|\s)*\)/i.test(valueString);
};

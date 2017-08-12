/* @flow */
"use strict";

const keywordSets = require("../reference/keywordSets");
const valueParser = require("postcss-value-parser");

/**
 * Check if a word is a font-size value.
 */
module.exports = function(word /*: string*/) /*: boolean*/ {
  if (!word) {
    return false;
  }

  if (keywordSets.fontSizeKeywords.has(word)) {
    return true;
  }

  const numberUnit = valueParser.unit(word);
  if (!numberUnit) {
    return false;
  }

  const unit = numberUnit.unit;

  if (unit === "%") {
    return true;
  }
  if (keywordSets.lengthUnits.has(unit.toLowerCase())) {
    return true;
  }

  return false;
};

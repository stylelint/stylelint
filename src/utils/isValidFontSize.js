import {
  fontSizeKeywords,
  lengthUnits,
} from "../reference/keywordSets"
import valueParser from "postcss-value-parser"

/**
 * Check if a word is a font-size value.
 *
 * @param {string} word
 * @return {boolean}
 */
export default function (word) {
  if (!word) { return false }

  if (fontSizeKeywords.has(word)) { return true }

  const numberUnit = valueParser.unit(word)
  if (!numberUnit) { return false }

  const { unit } = numberUnit
  if (unit === "%") { return true }
  if (lengthUnits.has(unit.toLowerCase())) { return true }

  return false
}

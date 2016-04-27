import postcss from "postcss"
import postcssValueParser from "postcss-value-parser"
import {
  isStandardValue,
  isVariable,
} from "./"

// https://www.w3.org/TR/css-fonts-3/#font-variant-prop
const fondShorthandKeywords = new Set([
  // all generic
  "inherit", "initial", "unset",
  // generic for all properties
  "normal",
  // font-style
  "italic", "oblique",
  // font-variant
  "historical-forms",
  "none",
  "common-ligatures", "no-common-ligatures", "discretionary-ligatures", "no-discretionary-ligatures",
  "historical-ligatures", "no-historical-ligatures", "contextual", "no-contextual",
  "small-caps", "small-caps", "all-small-caps", "petite-caps", "all-petite-caps", "unicase", "titling-caps",
  "lining-nums", "oldstyle-nums", "proportional-nums", "tabular-nums", "diagonal-fractions", "stacked-fractions",
  "ordinal", "slashed-zero",
  "jis78", "jis83", "jis90", "jis04", "simplified", "traditional", "full-width", "proportional-width", "ruby",
  // font-weight
  "bold", "lighter", "bolder",
  // font-stretch
  "semi-condensed", "condensed", "extra-condensed", "ultra-condensed",
  "semi-expanded", "expanded", "extra-expanded", "ultra-expanded",
  // font-size
  "xx-small", "x-small", "small", "medium", "large", "x-large", "xx-large", "larger", "smaller",
])

/**
 * Get the font-families and indexes of position font-family
 *
 * @param {string} value
 * @return {object} Object with name and index of position
 */
export default function findFontFamily(value) {
  const fontFamilies = []

  // remove spaces between font-size and line-height
  if (value.indexOf("/") !== -1) {
    value = value.replace(/\s*\/\s*/g, "/")
  }

  const valuesListByComma = postcss.list.comma(value)
  let index = -1
  let realIndex = -1

  for (const valueByComma of valuesListByComma) {
    const valueListBySpace = postcss.list.space(valueByComma)
    let fontFamily = ""

    for (const value of valueListBySpace) {
      index++
      realIndex++

      // Ignore non standard syntax
      if (!isStandardValue(value)) { continue }
      // Ignore variables
      if (isVariable(value)) { continue }
      // Ignore numbers with units
      if (postcssValueParser.unit(value)) { continue }
      // Ignore keywords for other animation parts
      if (fondShorthandKeywords.has(value)) { continue }
      // Ignore functions
      if (value.indexOf("(") !== -1) { continue }
      // If we next string
      if (valueListBySpace[index + 1]) {
        fontFamily += value + " "
        realIndex--
        continue
      }

      fontFamilies.push({
        name: fontFamily + value,
        index: realIndex,
      })
    }
  }

  return fontFamilies
}

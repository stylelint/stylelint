import { counterIncrementKeywords } from "../reference/keywordSets"
import { isFinite } from "lodash"

/**
 * Check value is a custom ident
 *
 * @param {string} value
 * @return {boolean} If `true`, value is a custom ident
 */

export default function (value) {
  const valueLowerCase = value.toLowerCase()

  if (counterIncrementKeywords.has(valueLowerCase) || isFinite(parseInt(valueLowerCase))) { return false }

  return true
}

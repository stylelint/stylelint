import { keyframeSelectorKeywords } from "../reference/keywordSets"

/**
 * Check whether a string is a keyframe selector.
 *
 * @param {string} selector
 * @return {boolean} If `true`, the selector is a keyframe selector
 */
export default function (selector) {
  if (keyframeSelectorKeywords.has(selector)) { return true }

  // Percentages
  if (/^(?:\d+\.?\d*|\d*\.?\d+)%$/.test(selector)) { return true }

  return false
}

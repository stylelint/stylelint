import { keyframeSelectorKeywords } from "../reference/keywordSets"

/**
 * Check whether a string is a keyframe selector.
 *
 * @param {string} selector
 * @return {boolean} If `true`, the selector is a keyframe selector
 */
export default function (selector) {
  const simpleSelectors = selector.split(",")
  for (const simpleSelector of simpleSelectors) {
    if (keyframeSelectorKeywords.has(simpleSelector)) { return true }

    // Percentages
    if (/^(?:\d+\.?\d*|\d*\.?\d+)%$/.test(simpleSelector)) { return true }
  }

  return false
}

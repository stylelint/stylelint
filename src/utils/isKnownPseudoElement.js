/**
 * Check is known pseudo-element
 *
 * @param {string} Pseudo-element
 * @return {boolean} If `true`, the unit is known
 */

// https://drafts.csswg.org/selectors-4/#overview
const knownOneColonNotationPseudoElements = new Set([
  "first-line", "first-letter", "before", "after",
])

const knownTwoColonNotationPseudoElements = new Set([
  "before", "after", "first-line", "first-letter",
  "selection", "spelling-error", "grammar-error",
  "backdrop", "marker", "placeholder",
  "shadow", "content",
])

export default function (pseudoElement, { only = false } = {}) {
  const pseudoElementLowerCase = pseudoElement.toLowerCase()

  if (only && only === "oneColonNotation") {
    return knownOneColonNotationPseudoElements.has(pseudoElementLowerCase)
  }

  return knownTwoColonNotationPseudoElements.has(pseudoElementLowerCase)
}

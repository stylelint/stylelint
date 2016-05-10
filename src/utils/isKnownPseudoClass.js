/**
 * Check is known pseudo-class
 *
 * @param {string} Pseudo-class
 * @return {boolean} If `true`, the unit is known
 */

// https://drafts.csswg.org/selectors-4/#overview
const knownPseudoClasses = new Set([
  "active", "any-link", "blank", "checked",
  "contains", "current", "default", "dir",
  "disabled", "drop", "empty", "enabled",
  "first-child", "first-of-type", "focus", "focus-within",
  "fullscreen", "future", "has", "hover",
  "indeterminate", "in-range", "invalid", "lang",
  "last-child", "last-of-type", "link", "matches",
  "not", "nth-child", "nth-column", "nth-last-child",
  "nth-last-column", "nth-last-of-type", "nth-of-type", "only-child",
  "only-of-type", "optional", "out-of-range", "past",
  "placeholder-shown", "read-only", "read-write", "required",
  "root", "scope", "target", "user-error",
  "user-invalid", "val", "valid", "visited",
])

export default function (pseudoClass) {
  return knownPseudoClasses.has(pseudoClass.toLowerCase())
}

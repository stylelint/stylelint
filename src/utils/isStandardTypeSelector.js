/**
 * Check whether a type selector is standard
 *
 * @param {Node} postcss-selector-parser node (of type tag)
 * @return {boolean} If `true`, the type selector is standard
 */

import {
  aNPlusBNotationPseudoClasses,
  linguisticPseudoClasses,
} from "../reference/keywordSets"

export default function (node) {

  // postcss-selector-parser includes the arguments to nth-child() functions
  // as "tags", so we need to ignore them ourselves.
  // The fake-tag's "parent" is actually a selector node, whose parent
  // should be the :nth-child pseudo node.
  const { parent: { parent: { type: parentType, value: parentValue } } } = node
  if (parentValue) {
    const normalisedParentName = parentValue.toLowerCase().replace(/:+/, "")
    if (
      parentType === "pseudo" && (
        aNPlusBNotationPseudoClasses.has(normalisedParentName)
        || linguisticPseudoClasses.has(normalisedParentName)
      )
    ) { return false }
  }

  // &-bar is a nesting selector combined with a suffix
  if (node.prev() && node.prev().type === "nesting") { return false }

  return true
}

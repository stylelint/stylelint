import _ from "lodash"
import { hasBlock } from "../utils"

/**
 * Check whether a property is a custom properties
 *
 * @param {string} rule
 * @return {boolean} If `true`, property is a custom properties
 */
export default function (rule) {
  const selector = _.get(rule, "raws.selector.raw", rule.selector)

  return rule.type === "rule" && hasBlock(rule) && selector.slice(0, 2) === "--" && selector.slice(-1) === ":"
}

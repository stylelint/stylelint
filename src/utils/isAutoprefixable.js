import autoprefixer from "autoprefixer"
import Prefixes from "autoprefixer/lib/prefixes"
import Browsers from "autoprefixer/lib/browsers"

/**
 * Use Autoprefixer's secret powers to determine whether or
 * not a certain CSS identifier contains a vendor prefix that
 * Autoprefixer, given the standardized identifier, could add itself.
 *
 * Used by `*-no-vendor-prefix-*` rules to find superfluous
 * vendor prefixes.
 */

const prefixes = new Prefixes(
  autoprefixer.data.prefixes,
  new Browsers(autoprefixer.data.browsers, [])
)

/**
 * Most identifier types have to be looked up in a unique way,
 * so we're exposing special functions for each.
 */
export default {

  atRuleName(identifier) {
    return prefixes.remove[`@${identifier}`]
  },

  selector(identifier) {
    return prefixes.remove.selectors.some(selectorObj => {
      return identifier === selectorObj.prefixed
    })
  },

  mediaFeatureName(identifier) {
    return identifier.indexOf("device-pixel-ratio") !== -1
  },

  property(identifier) {
    return autoprefixer.data.prefixes[prefixes.unprefixed(identifier)]
  },

  propertyValue(prop, value) {
    const possiblePrefixableValues = prefixes.remove[prop] && prefixes.remove[prop].values
    return possiblePrefixableValues && possiblePrefixableValues.some(valueObj => {
      return value === valueObj.prefixed
    })
  },

}

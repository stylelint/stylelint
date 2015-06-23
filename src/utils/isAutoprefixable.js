import autoprefixer from "autoprefixer-core"
import Prefixes from "autoprefixer-core/lib/prefixes"
import Browsers from "autoprefixer-core/lib/browsers"

const prefixes = new Prefixes(
  autoprefixer.data.prefixes,
  new Browsers(autoprefixer.data.browsers, [])
)

/**
 * Each function below determines whether a vendor-prefixed CSS identifier
 * would be taken care of by Autoprefixer if the standard
 * version of the identifier were used.
 */
export default {

  atRuleName(x) {
    return prefixes.remove[`@${x}`]
  },

  selector(x) {
    return prefixes.remove.selectors.some(selectorObj => {
      return x === selectorObj.prefixed
    })
  },

  mediaFeatureName(x) {
    return x.indexOf("device-pixel-ratio") !== -1
  },

  property(x) {
    return autoprefixer.data.prefixes[prefixes.unprefixed(x)]
  },

  propertyValue(p, v) {
    const possiblePrefixableValues = prefixes.remove[p] && prefixes.remove[p].values
    return possiblePrefixableValues && possiblePrefixableValues.some(valueObj => {
      return v === valueObj.prefixed
    })
  },

}

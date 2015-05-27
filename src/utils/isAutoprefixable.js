import autoprefixer from "autoprefixer-core"
import Prefixes from "autoprefixer-core/lib/prefixes"
import Browsers from "autoprefixer-core/lib/browsers"

const prefixes = new Prefixes(
  autoprefixer.data.prefixes,
  new Browsers(autoprefixer.data.browsers, [])
)

/**
 * Determine whether a vendor-prefixed CSS identifier
 * would be added by Autoprefixer if the standard
 * version of the identifier were used.
 *
 * @param {string} prefixedIdent
 * @return {boolean}
 */
export default function (prefixedIdent) {
  return autoprefixer.data.prefixes[prefixes.unprefixed(prefixedIdent)]
}

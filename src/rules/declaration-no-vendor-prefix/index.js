import autoprefixer from "autoprefixer-core"
import Prefixes from "autoprefixer-core/lib/prefixes"
import Browsers from "autoprefixer-core/lib/browsers"
import { ruleMessages } from "../../utils"

export const ruleName = "declaration-no-vendor-prefix"

export const messages = ruleMessages(ruleName, {
  rejected: p => `Unexpected vendor prefix "${p}"`,
})

const prefixes = new Prefixes(
  autoprefixer.data.prefixes,
  new Browsers(autoprefixer.data.browsers, [])
)

export default function () {
  return function (css, result) {
    css.eachDecl(function (decl) {
      checkIdent(decl.prop, decl)
      checkIdent(decl.value, decl)
    })

    function checkIdent(ident, node) {
      if (ident[0] !== "-") { return }

      const unprefixed = prefixes.unprefixed(ident)

      if (autoprefixer.data.prefixes[unprefixed]) {
        result.warn(messages.rejected(ident), { node })
      }
    }
  }
}

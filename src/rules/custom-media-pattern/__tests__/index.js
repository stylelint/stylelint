import {
  ruleTester,
  warningFreeBasics
} from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

testRule(/foo-.+/, tr => {
  warningFreeBasics(tr)

  tr.ok("@keyframes foofoo {}")

  tr.ok("@custom-media --foo-bar (min-width: 0);")
  tr.ok("@custom-media --foo-foofoo (min-width: 0);")

  tr.notOk("@custom-media --foa-bar (min-width: 0);", messages.rejected)
  tr.notOk("@custom-media --foa (min-width: 0);", messages.rejected)
})

testRule(/^[A-Z][a-z]+-[a-z][a-zA-Z]+$/, tr => {
  warningFreeBasics(tr)

  tr.ok("@custom-media --Ape-ageLess")
  tr.ok("@custom-media --Purr-piratePlant")

  tr.notOk("@custom-media --ape-ageLess", messages.rejected)
  tr.notOk("@custom-media --Ape-AgeLess", messages.rejected)
})

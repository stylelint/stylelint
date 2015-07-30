import {
  ruleTester,
  warningFreeBasics
} from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

testRule(undefined, tr => {
  warningFreeBasics(tr)

  // Right now we're under the impression that the only
  // media feature name we have to catch is any of the prefixed
  // `device-pixel-ratio` ones
  tr.ok("@media (min-resolution: 96dpi) {}")

  tr.notOk("@media (-webkit-min-device-pixel-ratio: 1) {}", messages.rejected)
  tr.notOk("@media (min--mox-device-pixel-ratio: 1) {}", messages.rejected)
  tr.notOk("@media (-o-max-device-pixel-ratio: 1/1) {}", messages.rejected)
})

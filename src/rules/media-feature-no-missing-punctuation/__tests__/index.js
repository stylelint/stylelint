import {
  ruleTester,
  warningFreeBasics,
} from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

testRule(true, tr => {
  warningFreeBasics(tr)

  tr.ok("@nonsense (min-width max-width no-width) {}")

  tr.ok("@media (min-width: 300px) {}")
  tr.ok("@media (min-width   :\t300px) {}")
  tr.ok("@media (width > 20em) {}")
  tr.ok("@media (width> 20em) {}")
  tr.ok("@media (width >20em) {}")
  tr.ok("@media (width>20em) {}")
  tr.ok("@media (10px <= width < 20em) {}")
  tr.ok("@media (10px<= width < 20em) {}")
  tr.ok("@media (10px<= width <20em) {}")
  tr.ok("@media only screen and (min-width: 300px) and (max-width: 600px) {}")

  tr.notOk("@media (min-width 300px) {}", {
    message: messages.rejected,
    line: 1,
    column: 8,
  })
  tr.notOk("@media (min-width   \t300px)", messages.rejected)
  tr.notOk("@media (10px width <= 20em)", messages.rejected)
  tr.notOk("@media (10px <= width 20em  )", messages.rejected)
  tr.notOk("@media only screen\n  and (min-width: 300px)\n  and (max-width 600px) {}", {
    message: messages.rejected,
    line: 3,
    column: 7,
  })
})

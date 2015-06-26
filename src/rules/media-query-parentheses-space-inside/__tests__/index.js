import {
  ruleTester,
  warningFreeBasics
} from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

testRule("always", tr => {
  warningFreeBasics(tr)

  tr.ok("@media ( max-width: 300px ) {}")
  tr.ok("@media screen and ( color ), projection and ( color ) {}")
  tr.ok("@media ( grid ) and ( max-width: 15em ) {}")

  tr.notOk("@media (max-width: 300px ) {}", messages.expectedOpening)
  tr.notOk("@media ( max-width: 300px) {}", messages.expectedClosing)
  tr.notOk("@media screen and (color ), projection and ( color ) {}", messages.expectedOpening)
  tr.notOk("@media screen and ( color), projection and ( color ) {}", messages.expectedClosing)
  tr.notOk("@media screen and ( color ), projection and (color ) {}", messages.expectedOpening)
  tr.notOk("@media screen and ( color ), projection and ( color) {}", messages.expectedClosing)
  tr.notOk("@media ( grid ) and (max-width: 15em ) {}", messages.expectedOpening)
})

testRule("never", tr => {
  warningFreeBasics(tr)

  tr.ok("@media (max-width: 300px) {}")
  tr.ok("@media screen and (color), projection and (color) {}")
  tr.ok("@media (grid) and (max-width: 15em) {}")

  tr.notOk("@media (max-width: 300px ) {}", messages.rejectedClosing)
  tr.notOk("@media ( max-width: 300px) {}", messages.rejectedOpening)
  tr.notOk("@media screen and (color ), projection and (color) {}", messages.rejectedClosing)
  tr.notOk("@media screen and ( color), projection and (color) {}", messages.rejectedOpening)
  tr.notOk("@media screen and (color), projection and (color ) {}", messages.rejectedClosing)
  tr.notOk("@media screen and (color), projection and ( color) {}", messages.rejectedOpening)
  tr.notOk("@media (grid) and (max-width: 15em ) {}", messages.rejectedClosing)
})

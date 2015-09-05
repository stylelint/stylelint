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

  tr.notOk("@media (max-width: 300px ) {}", {
    message: messages.expectedOpening,
    line: 1,
    column: 9,
  })
  tr.notOk("@media ( max-width: 300px) {}", {
    message: messages.expectedClosing,
    line: 1,
    column: 25,
  })
  tr.notOk("@media screen and (color ), projection and ( color ) {}", {
    message: messages.expectedOpening,
    line: 1,
    column: 20,
  })
  tr.notOk("@media screen and ( color), projection and ( color ) {}", {
    message: messages.expectedClosing,
    line: 1,
    column: 25,
  })
  tr.notOk("@media screen and ( color ), projection and (color ) {}", {
    message: messages.expectedOpening,
    line: 1,
    column: 46,
  })
  tr.notOk("@media screen and ( color ), projection and ( color) {}", {
    message: messages.expectedClosing,
    line: 1,
    column: 51,
  })
  tr.notOk("@media ( grid ) and (max-width: 15em ) {}", {
    message: messages.expectedOpening,
    line: 1,
    column: 22,
  })
})

testRule("never", tr => {
  warningFreeBasics(tr)

  tr.ok("@media (max-width: 300px) {}")
  tr.ok("@media screen and (color), projection and (color) {}")
  tr.ok("@media (grid) and (max-width: 15em) {}")

  tr.notOk("@media (max-width: 300px ) {}", {
    message: messages.rejectedClosing,
    line: 1,
    column: 25,
  })
  tr.notOk("@media ( max-width: 300px) {}", {
    message: messages.rejectedOpening,
    line: 1,
    column: 9,
  })
  tr.notOk("@media screen and (color ), projection and (color) {}", {
    message: messages.rejectedClosing,
    line: 1,
    column: 25,
  })
  tr.notOk("@media screen and ( color), projection and (color) {}", {
    message: messages.rejectedOpening,
    line: 1,
    column: 20,
  })
  tr.notOk("@media screen and (color), projection and (color ) {}", {
    message: messages.rejectedClosing,
    line: 1,
    column: 49,
  })
  tr.notOk("@media screen and (color), projection and ( color) {}", {
    message: messages.rejectedOpening,
    line: 1,
    column: 44,
  })
  tr.notOk("@media (grid) and (max-width: 15em ) {}", {
    message: messages.rejectedClosing,
    line: 1,
    column: 35,
  })
})

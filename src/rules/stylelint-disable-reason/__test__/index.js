import {
  ruleTester,
  warningFreeBasics,
} from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

testRule("always-preceding", tr => {
  warningFreeBasics(tr)

  tr.ok("/* reason */\n/* stylelint-disable */\na {}")
  tr.ok("a {}/* reason *//* stylelint-disable-line block-no-empty */")

  tr.notOk("a {}/* stylelint-disable-line */", {
    message: messages.expectedPreceding,
    line: 1,
    column: 6,
  })
  tr.notOk("/* stylelint-disable */\na {}", {
    message: messages.expectedPreceding,
    line: 1,
    column: 1,
  })
  tr.notOk("/* stylelint-disable */\n/* reason */\na {}", {
    message: messages.expectedPreceding,
    line: 1,
    column: 1,
  })
  tr.notOk("/* reason */\n/* stylelint-disable block-no-empty */\n/* stylelint-disable no-browser-hacks */\na {}", {
    message: messages.expectedPreceding,
    line: 3,
    column: 1,
  })
})

testRule("always-succeeding", tr => {
  warningFreeBasics(tr)

  tr.ok("/* stylelint-disable */\n/* reason */\na {}")
  tr.ok("a {}/* stylelint-disable-line *//* reason */")

  tr.notOk("a {}/* stylelint-disable-line block-no-empty */", {
    message: messages.expectedSucceeding,
    line: 1,
    column: 5,
  })
  tr.notOk("/* stylelint-disable */\na {}", {
    message: messages.expectedSucceeding,
    line: 1,
    column: 1,
  })
  tr.notOk("/* reason */\n/* stylelint-disable */\na {}", {
    message: messages.expectedSucceeding,
    line: 2,
    column: 1,
  })
  tr.notOk("/* stylelint-disable block-no-empty */\n/* reason */\n/* stylelint-disable no-browser-hacks */\na {}", {
    message: messages.expectedSucceeding,
    line: 3,
    column: 1,
  })
})

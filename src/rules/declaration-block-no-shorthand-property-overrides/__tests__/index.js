import {
  ruleTester,
  warningFreeBasics,
} from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

testRule(undefined, tr => {
  warningFreeBasics(tr)

  tr.ok("a { padding: 10px; }")
  tr.ok("a { padding: 10px; padding-left: 20px; }")
  tr.ok("@media (color) { padding: 10px; padding-left: 20px; }")
  tr.ok("a { @media (color) { padding: 10px; padding-left: 20px; }}")
  tr.notOk(
    "a { padding-left: 10px; padding: 20px; }",
    messages.rejected("padding", "padding-left")
  )

  tr.ok("a { padding-left: 10px; { b { padding: 20px; }}}", "nested related properties")
  tr.notOk(
    "a { padding-left: 10px; { b { padding-top: 10px; padding: 20px; }}}",
    messages.rejected("padding", "padding-top"),
    "override within nested rule"
  )

  tr.ok("a { border-top-width: 1px; top: 0; bottom: 3px; border-bottom: 2px solid blue; }")
  tr.notOk(
    "a { border-top-width: 1px; top: 0; bottom: 3px; border: 2px solid blue; }",
    messages.rejected("border", "border-top-width")
  )

  tr.ok("a { transition-property: opacity; } a { transition: opacity 1s linear; }")
  tr.ok("a { transition-property: opacity; -webkit-transition: opacity 1s linear; }")
  tr.notOk(
    "a { transition-property: opacity; transition: opacity 1s linear; }",
    messages.rejected("transition", "transition-property")
  )

  tr.notOk(
    "a { background-repeat: no-repeat; background: url(lion.png); }",
    messages.rejected("background", "background-repeat")
  )
  tr.notOk(
    "@media (color) { background-repeat: no-repeat; background: url(lion.png); }",
    messages.rejected("background", "background-repeat")
  )
  tr.notOk(
    "a { @media (color) { background-repeat: no-repeat; background: url(lion.png); }}",
    messages.rejected("background", "background-repeat")
  )
})

import {
  ruleTester,
  warningFreeBasics,
} from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

testRule(1, tr => {
  warningFreeBasics(tr)
  tr.ok("a { b { top: 0; }}")
  tr.notOk("a { b { c { top: 0; }}}", messages.rejected(1))

  tr.ok("@media print { a { b { top: 0; }}}")
  tr.notOk("@media print { a { b { c { top: 0; }}}}", messages.rejected(1))

  tr.ok("a { top: 0; b { top: 0; }}")
  tr.notOk("a { top: 0; b { top: 0; c { top: 0; }}}", messages.rejected(1))

  tr.notOk("a { b { top: 0; c { top: 0; }} top: 0; }", messages.rejected(1))

  tr.ok("a { @nest b { top: 0; }}")
  tr.notOk("a { @nest b { c { top: 0; }}}", messages.rejected(1))
})

testRule(3, tr => {
  warningFreeBasics(tr)
  tr.ok("a { b { c { d { top: 0; }}}}")
  tr.notOk("a { b { c { d { e { top: 0; }}}}}", messages.rejected(3))

  tr.ok("@media print { a { b { c { d { top: 0; }}}}}")

  tr.ok("a { & > b { @media print { color: pink; }}}")
  tr.ok("a { & > b { & > c { @media print { color: pink; }}}}", messages.rejected(3))
})

testRule(1, { ignore: ["at-rules-without-declaration-blocks"] }, tr => {
  warningFreeBasics(tr)
  tr.ok("a { b { top: 0; }}")
  tr.ok("a { @media print { b { top: 0; }}}")
  tr.ok("a { @nest b { c { top: 0; }}}")
  tr.notOk("a { b { c { top: 0; }}}", messages.rejected(1))
  tr.notOk("a { @media print { b { c { top: 0; }}}}", messages.rejected(1))
  tr.notOk("a { @nest b { @nest c { top: 0; @nest d { bottom: 0; }}}}", messages.rejected(1))
})

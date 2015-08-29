/* eslint-disable indent, no-multiple-empty-lines */

import {
  ruleTester,
  warningFreeBasics
} from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

testRule("tab", tr => {
warningFreeBasics(tr)

tr.ok(
`/* blergh */`)

tr.notOk(
` /* blergh */`,
{
  message: messages.expected("0 tabs at line 1"),
  line: 1,
  column: 2,
})

tr.ok(
`.foo {
\t/* blergh */
\ttop: 0;
}`
)

tr.notOk(
`.foo {
\t\t/* blergh */
\ttop: 0;
}`,
{
  message: messages.expected("1 tab at line 2"),
  line: 2,
  column: 3,
})

tr.ok(
`@media print {
\t.foo {
\t\t/* blergh */
\t\ttop: 0;
\t}
}`
)

tr.notOk(
`@media print {
\t.foo {
\t/* blergh */
\t\ttop: 0;
\t}
}`,
{
  message: messages.expected("2 tabs at line 3"),
  line: 3,
  column: 2,
})

})

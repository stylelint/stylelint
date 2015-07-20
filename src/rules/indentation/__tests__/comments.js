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
messages.expected("0 tabs at line 1"))

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
messages.expected("1 tab at line 2"))

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
messages.expected("2 tabs at line 3"))

})

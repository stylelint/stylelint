/* eslint-disable indent, no-multiple-empty-lines */

import {
  ruleTester,
  warningFreeBasics
} from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

// 2 spaces
testRule(2, { hierarchical: true }, tr => {
warningFreeBasics(tr)

tr.ok(
`@media print {
  a {
    color: pink;
  }
}`
)

tr.ok(
`.foo {}
.bar {}
.baz {}`
)

tr.notOk(
`.foo {}
  .bar {}
.baz {}`,
messages.expected("0 spaces at line 2"))

tr.ok(
`.foo {}
  .foo-one {}
.bar {}
  .bar-one {}`
)

tr.notOk(
`.foo {}
    .foo-one {}
.bar {}
  .bar-one {}`,
messages.expected("2 spaces at line 2"))

tr.notOk(
`.foo {}
  .foo-one {}
.bar {}
   .bar-one {}`,
messages.expected("2 spaces at line 4"))

tr.notOk(
`.foo {}
  .foo-one {}
  .bar {}
  .bar-one {}`,
messages.expected("0 spaces at line 3"))

tr.ok(
`.foo {}
  .foo-one {}
    .foo-one-sub {}`
)

tr.notOk(
`.foo {}
  .foo-one {}
  .foo-one-sub {}`,
messages.expected("4 spaces at line 3"))

tr.ok(
`.foo {}
  .foo-one {}
  .foo-two {}
    .foo-two-sub {}
  .foo-three {}
.bar {}`
)

tr.notOk(
`.foo {}
  .foo-one {}
  .foo-two {}
  .foo-two-sub {}
  .foo-three {}
.bar {}`,
messages.expected("4 spaces at line 4"))

tr.notOk(
`.foo {}
  .foo-one {}
  .foo-two {}
    .foo-two-sub {}
  .foo-three {}
  .bar {}`,
messages.expected("0 spaces at line 6"))

tr.ok(
`#foo {}
  #foo ul {}
    #foo ul > li {}
      #foo ul > li span {}
    #foo ul a {}
  #foo div {}
    #foo div span {}
#bar {}`
)

tr.notOk(
`#foo {}
  #foo ul {}
    #foo ul > li {}
      #foo ul li span {}
    #foo ul a {}
  #foo div {}
    #foo div span {}
#bar {}`,
messages.expected("4 spaces at line 4"))

tr.notOk(
`#foo {}
  #foo ul {}
    #foo ul > li {}
      #foo ul > li span {}
  #foo ul a {}
  #foo div {}
    #foo div span {}
#bar {}`,
messages.expected("4 spaces at line 5"))

tr.ok(
`#bar {}
#baz {}
#bar a {}
#baz b {}`
)

tr.notOk(
`#bar {}
#baz {}
  #bar a {}
#baz b {}`,
messages.expected("0 spaces at line 3"))

})

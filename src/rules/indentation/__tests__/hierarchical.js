/* eslint-disable indent, no-multiple-empty-lines */

import {
  ruleTester,
  warningFreeBasics
} from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

testRule(2, { hierarchicalSelectors: true }, tr => {
warningFreeBasics(tr)

tr.ok(
`.foo {}
.foo {}`
)

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

tr.ok(
`.foo {
  top: 0;
}
  .foo-one {
    top: 1px;
  }`
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
  .bar-one {
  top: 0;
  }`,
messages.expected("4 spaces at line 5"))

tr.notOk(
`.foo {}
  .foo-one {}
  .bar {}
  .bar-one {}`,
messages.expected("0 spaces at line 3"))

tr.notOk(
`.foo {}
  .foo-one {
    color: pink;
     top: 0;
  }`,
messages.expected("4 spaces at line 4"))

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
  .foo-one {
    top: 0;
  }
  .foo-two {}
    .foo-two-sub {
      top: 10px;
    }
  .foo-three {}
  .bar {}`,
messages.expected("0 spaces at line 10"))

tr.ok(
`#foo {
  top: 3px;
}
  #foo ul {}
    #foo ul > li {}
      #foo ul > li span {
        top: 4px;
      }
    #foo ul a {}
  #foo div {
    top: 6px;
  }
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

tr.ok(
`@media print {
  .foo {
    top: 0;
  }
    .foo-bar {
      top: 10px;
    }
  .bar {
    top: 1px;
  }
}`
)

tr.notOk(
`@media print {
  .foo {
    top: 0;
  }
    .foo-bar {
      top: 10px;
       bottom: 0;
    }
  .bar {
    top: 1px;
  }
}`,
messages.expected("6 spaces at line 7"))

tr.ok(
`.foo {}
  @media print {
    .foo-one {
      color: pink;
    }
  }`
)

tr.notOk(
`.foo {}
  @media print {
  .foo-one {
      color: pink;
    }
  }`,
messages.expected("4 spaces at line 3"))

tr.ok(
`.foo {}
  @media print {
    .foo-one {}
  }`
)

tr.notOk(
`.foo {}
  @media print {
      .foo-one {}
  }`,
messages.expected("4 spaces at line 3"))

})

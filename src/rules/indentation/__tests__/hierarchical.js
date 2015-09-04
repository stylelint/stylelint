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
{
  message: messages.expected("0 spaces"),
  line: 2,
  column: 3,
})

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
{
  message: messages.expected("2 spaces"),
  line: 2,
  column: 5,
})

tr.notOk(
`.foo {}
  .foo-one {}
.bar {}
   .bar-one {}`,
{
  message: messages.expected("2 spaces"),
  line: 4,
  column: 4,
})

tr.notOk(
`.foo {}
  .foo-one {}
.bar {}
  .bar-one {
  top: 0;
  }`,
{
  message: messages.expected("4 spaces"),
  line: 5,
  column: 3,
})

tr.notOk(
`.foo {}
  .foo-one {}
  .bar {}
  .bar-one {}`,
{
  message: messages.expected("0 spaces"),
  line: 3,
  column: 3,
})

tr.notOk(
`.foo {}
  .foo-one {
    color: pink;
     top: 0;
  }`,
{
  message: messages.expected("4 spaces"),
  line: 4,
  column: 6,
})

tr.ok(
`.foo {}
  .foo-one {}
    .foo-one-sub {}`
)

tr.notOk(
`.foo {}
  .foo-one {}
  .foo-one-sub {}`,
{
  message: messages.expected("4 spaces"),
  line: 3,
  column: 3,
})

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
{
  message: messages.expected("4 spaces"),
  line: 4,
  column: 3,
})

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
{
  message: messages.expected("0 spaces"),
  line: 10,
  column: 3,
})

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
{
  message: messages.expected("4 spaces"),
  line: 4,
  column: 7,
})

tr.notOk(
`#foo {}
  #foo ul {}
    #foo ul > li {}
      #foo ul > li span {}
  #foo ul a {}
  #foo div {}
    #foo div span {}
#bar {}`,
{
  message: messages.expected("4 spaces"),
  line: 5,
  column: 3,
})

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
{
  message: messages.expected("0 spaces"),
  line: 3,
  column: 3,
})

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
{
  message: messages.expected("6 spaces"),
  line: 7,
  column: 8,
})

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
{
  message: messages.expected("4 spaces"),
  line: 3,
  column: 3,
})

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
{
  message: messages.expected("4 spaces"),
  line: 3,
  column: 7,
})

tr.ok(
`:root {
  --Grid: #fff;
}

.r-Grid {
  color: red;
}

  .r-Grid-cell {
    text-align: center;
  }`
)

})

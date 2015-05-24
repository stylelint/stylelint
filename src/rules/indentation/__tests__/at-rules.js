/* eslint-disable indent, no-multiple-empty-lines */

import { ruleTester } from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

// { space: 2 }
testRule({ space: 2 }, tr => {

tr.ok(
`@media print {
  a {
    color: pink;
  }
}`)

tr.ok(
`@media print {
  a {
    color: pink;
  }
}

@media screen {
  b { color: orange; }
}`)

tr.notOk(
`  @media print {
  a {
    color: pink;
  }
}`, messages.expected("0 spaces at line 1"))

tr.notOk(
`@media print {
a {
    color: pink;
  }
}`, messages.expected("2 spaces at line 2"))

tr.notOk(
`@media print {
  a {
  color: pink;
  }
}`, messages.expected("4 spaces at line 3"))

tr.notOk(
`@media print {
  a {
    color: pink;
}
}`, messages.expected("2 spaces at line 4"))

tr.notOk(
`@media print {
  a {
    color: pink;
  }
\t}`, messages.expected("0 spaces at line 5"))

})

// { space: "tab", block: "never"  }
testRule({ space: "tab", block: "never" }, tr => {

tr.ok(
`@media print {

a {
\tcolor: pink;
}

}`)

tr.notOk(
`@media print {

\ta {
\tcolor: pink;
}

}`, messages.expected("0 tabs at line 3"))

tr.notOk(
`@media print {

a {
color: pink;
}

}`, messages.expected("1 tab at line 4"))

})

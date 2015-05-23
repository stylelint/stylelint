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

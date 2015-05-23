/* eslint-disable indent, no-multiple-empty-lines */

import { ruleTester } from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

// { space: 2 }
testRule({ space: 2 }, tr => {

tr.ok("")
tr.ok("a {color: pink;}")

tr.ok(
`a {
  color: pink;
}`)

tr.ok(
`a { color: pink;
}`)

tr.ok(
`a {
  color: pink;
} b { top: 0; }`)

tr.ok(
`a { color: pink;
  top: 0; background: orange;
}`)

tr.ok(
`a {
  color: pink;
}


b {
  color: orange
}`)

tr.ok(
`a {
  color: pink;}`)

tr.ok(
`a {
  background-position: top left,
    top right,
    bottom left;
  color: pink;
}`)

// Rule start/end errors
tr.notOk(
`\ta {
  color: pink;
}`,
messages.expected("0 spaces at line 1"))

tr.notOk(
`a {
  color: pink;
  }`,
messages.expected("0 spaces at line 3"))

tr.notOk(
`a { color: pink;
  }`,
messages.expected("0 spaces at line 2"))

tr.notOk(
`a {
  color: pink
}
 b {
  color: orange
}`
, messages.expected("0 spaces at line 4"))

tr.notOk(
`a {
  color: pink
}
b {
  color: orange
 }`,
messages.expected("0 spaces at line 6"))

// Declaration errors
tr.notOk(
`a {
color: pink;
}`,
messages.expected("2 spaces at line 2"))

tr.notOk(
`a {
\tcolor: pink;
}`,
messages.expected("2 spaces at line 2"))

tr.notOk(
`a {
  color: pink;
 background: orange;
}`,
messages.expected("2 spaces at line 3"))


tr.notOk(
`a {
  background-position: top left,
  top right,
    bottom left;
  color: pink;
}`,
messages.expected("4 spaces at line 3"))

tr.notOk(
`a {
  background-position: top left,
    top right,
  bottom left;
  color: pink;
}`,
messages.expected("4 spaces at line 4"))

})

// { space: "tab" }
testRule({ space: "tab" }, tr => {

tr.ok("")
tr.ok("a {color: pink;}")

tr.ok(
`a {
\tcolor: pink;
}`)

tr.ok(
`a {
\tcolor: pink;
}

b {
\tcolor: orange
}`)

tr.ok(
`a {
\tcolor: pink;}`)

// Rule start/end errors
tr.notOk(
`\ta {
\tcolor: pink;
}`,
messages.expected("0 tabs at line 1"))

tr.notOk(
`a {
\tcolor: pink;
  }`,
messages.expected("0 tabs at line 3"))

tr.notOk(
`a {
\tcolor: pink
}
 b {
\tcolor: orange
}`
, messages.expected("0 tabs at line 4"))

tr.notOk(
`a {
\tcolor: pink
}
b {
\tcolor: orange
 }`,
messages.expected("0 tabs at line 6"))

// Declaration errors
tr.notOk(
`a {
color: pink;
}`,
messages.expected("1 tab at line 2"))

tr.notOk(
`a {
  color: pink;
}`,
messages.expected("1 tab at line 2"))

tr.notOk(
`a {
\tcolor: pink;
 background: orange;
}`,
messages.expected("1 tab at line 3"))

tr.notOk(
`a { color: pink;
top: 0; background: orange;
}`,
messages.expected("1 tab at line 2"))

})

// { space: 2, value: "never" }
testRule({ space: 2, value: "never" }, tr => {

tr.ok(
`a {
  background-position: top left, top right, bottom left;
  color: pink;
}`)

tr.ok(
`a {
  background-position: top left,
  top right,
  bottom left;
  color: pink;
}`)

tr.notOk(
`a {
  background-position: top left,
    top right,
  bottom left;
  color: pink;
}`,
messages.expected("2 spaces at line 3"))

tr.notOk(
`a {
  background-position: top left,
  top right,
    bottom left;
  color: pink;
}`,
messages.expected("2 spaces at line 4"))

})

import {
  ruleTester,
  warningFreeBasics,
} from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

testRule("always", tr => {
  warningFreeBasics(tr)

  tr.ok(
    "a {\n" +
    "  color:\n" +
    "    pink\n" +
    "}",
    "newline and spaces after"
  )
  tr.ok(
    "a { color :\npink }",
    "space before and newline after"
  )
  tr.ok(
    "a { color\n:\npink }",
    "newline before after"
  )
  tr.ok(
    "a { color\r\n:\r\npink }",
    "CRLF before and after"
  )
  tr.ok(
    "$map: (key: value)",
    "SCSS map with no newlines"
  )

  tr.notOk(
    "a { color :pink; }",
    {
      message: messages.expectedAfter(),
      line: 1,
      column: 11,
    },
    "no newline after"
  )
  tr.notOk(
    "a { color :  pink; }",
    {
      message: messages.expectedAfter(),
      line: 1,
      column: 11,
    },
    "two spaces after"
  )
  tr.notOk(
    "a { color :\tpink; }",
    {
      message: messages.expectedAfter(),
      line: 1,
      column: 11,
    },
    "tab after"
  )
  tr.notOk(
    "a { color : pink; }",
    {
      message: messages.expectedAfter(),
      line: 1,
      column: 11,
    },
    "space after"
  )
})

testRule("always-multi-line", tr => {
  warningFreeBasics(tr)

  tr.ok(
    "a {\n" +
    "  color: pink\n" +
    "}"
  )

  tr.ok(
    "a {\n" +
    "  box-shadow:\n" +
    "    0 0 0 1px #5b9dd9\n" +
    "    0 0 2px 1px rgba(30, 140, 190, 0.8);\n" +
    "}"
  )

  tr.ok(
    "$map\n: (\nkey: value,\nkey2 :value2)",
    "SCSS map with newlines"
  )

  tr.notOk(
    "a {\n" +
    "  box-shadow: 0 0 0 1px #5b9dd9\n" +
    "    0 0 2px 1px rgba(30, 140, 190, 0.8);\n" +
    "}",
    {
      message: messages.expectedAfterMultiLine(),
      line: 2,
      column: 13,
    }
  )

  tr.ok("a { color:pink }")
  tr.ok("a { color :\tpink }")
  tr.ok("a { color\n: pink }")
  tr.ok("a { color\r\n:  pink }")
})

import {
  ruleTester,
  warningFreeBasics,
} from "../../../testUtils"
import rule, { ruleName, messages } from ".."
import scssSyntax from "postcss-scss"

const testRule = ruleTester(rule, ruleName)

function alwaysTestsCommon(tr) {
  warningFreeBasics(tr)

  tr.ok("/** comment */", "first node ignored")
  tr.ok("a { color: pink; /** comment */\ntop: 0; }", "inline comment ignored")
  tr.ok("a {} /** comment */", "inline comment ignored")
  tr.ok("a {}\n\n/** comment */")
  tr.ok("a {}\r\n\r\n/** comment */", "CRLF")
  tr.ok("a { color: pink;\n\n/** comment */\ntop: 0; }")

  tr.notOk("a { color: pink;\n/** comment */\ntop: 0; }", messages.expected)
  tr.notOk("a { color: pink;\r\n/** comment */\r\ntop: 0; }", messages.expected, "CRLF")
}

function alwaysTests(tr) {
  alwaysTestsCommon(tr)
  tr.notOk("/** comment */\n/** comment */", messages.expected)
  tr.notOk("/** comment */\r\n/** comment */", messages.expected, "CRLF")
}

testRule("always", tr => {
  alwaysTests(tr)

  tr.ok(
    "a {\n\n  /* comment */\n  color: pink;\n}",
    "first-nested with empty line before"
  )
  tr.notOk(
    "a {\n  /* comment */\n  color: pink;\n}",
    {
      message: messages.expected,
      line: 2,
      column: 3,
    },
    "first-nested without empty line before"
  )
})

testRule("always", { except: ["first-nested"] }, tr => {
  alwaysTests(tr)

  tr.ok(
    "a {\n  /* comment */\n  color: pink;\n}",
    "first-nested without empty line before"
  )
  tr.notOk(
    "a {\n\n  /* comment */\n  color: pink;\n}",
    {
      message: messages.rejected,
      line: 3,
      column: 3,
    },
    "first-nested with empty line before"
  )
})

testRule("always", { ignore: ["stylelint-commands"] }, tr => {
  alwaysTests(tr)
  tr.ok(
    "a {\ncolor: pink;\n/* stylelint-disable something */\ntop: 0;\n}",
    "no newline before a stylelint command comment"
  )
})

testRule("always", { ignore: ["between-comments"] }, tr => {
  alwaysTestsCommon(tr)
  tr.ok(
    "/* a */\n/* b */\n/* c */\nbody {\n}",
    "no newline between comments"
  )
  tr.ok("a { color: pink;\n\n/** comment */\n/** comment */\ntop: 0; }", "no newline between comments")
  tr.notOk("a { color: pink;\n/** comment */\n/** comment */\ntop: 0; }", messages.expected)
})

testRule("never", tr => {
  warningFreeBasics(tr)

  tr.ok("\n\n/** comment */", "first node ignored")
  tr.ok("\r\n\r\n/** comment */", "first node ignored and CRLF")
  tr.ok("a { color: pink; /** comment */\ntop: 0; }", "inline comment ignored")
  tr.ok("a {} /** comment */")
  tr.ok("a { color: pink;\n/** comment */\n\ntop: 0; }")
  tr.ok("a { color: pink;\r\n/** comment */\r\n\r\ntop: 0; }", "CRLF")

  tr.notOk("/** comment */\n\n/** comment */", messages.rejected)
  tr.notOk("a {}\n\n\n/** comment */", messages.rejected)
  tr.notOk("a {}\r\n\r\n\r\n/** comment */", messages.rejected, "CRLF")
  tr.notOk("a { color: pink;\n\n/** comment */\ntop: 0; }", messages.rejected)
})

const testRuleScss = ruleTester(rule, ruleName, {
  postcssOptions: {
    syntax: scssSyntax,
  },
})

testRuleScss("always", tr => {
  tr.ok("a { color: pink;\n// comment\ntop: 0; }", "single-line comment ignored")
  tr.ok("// first line\n// second line\na { color: pink; }", "subsequent single-line comments ingnored")
})

testRuleScss("never", tr => {
  tr.ok("a { color: pink;\n\n// comment\ntop: 0; }", "single-line comment ignored")
})

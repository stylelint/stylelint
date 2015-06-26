import {
  ruleTester,
  warningFreeBasics
} from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

testRule("always", tr => {
  warningFreeBasics(tr)

  tr.ok("a { color: pink;\n}")
  tr.ok("a::before { content: \";a\";\n}")
  tr.ok("a {\ncolor: pink;\n top:0;\n}")
  tr.ok("a {\ncolor: pink;\n  top:0;\n}")
  tr.ok("a {\ncolor: pink;\n\ttop:0;\n}")
  tr.ok("a { color: pink;\ntop: 0; }", "space between trailing semicolon and closing brace")
  tr.ok("a { color: pink;\ntop: 0;}", "no space between trailing semicolon and closing brace")
  tr.ok("a { color: pink;\ntop: 0}")
  tr.ok("a {\n  color: pink; /* 1 */\n  top: 0\n}", "end-of-line comment")
  tr.ok("a {\n  color: pink;\n  /* 1 */\n  top: 0\n}", "next-line comment")
  tr.ok("a,\nb { color: pink;\ntop: 0}", "multi-line rule, multi-line declaration-block")

  tr.notOk("a { color: pink;top: 0; }", messages.expectedAfter())
  tr.notOk("a { color: pink; top: 0; }", messages.expectedAfter())
  tr.notOk("a { color: pink; top: 0; }", messages.expectedAfter())
  tr.notOk("a { color: pink;\ttop: 0; }", messages.expectedAfter())
  tr.notOk(
    "a {\n  color: pink;  /* 1 */\n  top: 0\n}",
    messages.expectedAfter(),
    "end-of-line comment with two spaces before"
  )
  tr.notOk(
    "a {\n  color: pink; /* 1 */ top: 0\n}",
    messages.expectedAfter(),
    "next node is comment without newline after"
  )
})

testRule("always-multi-line", tr => {
  warningFreeBasics(tr)

  tr.ok("a {\ncolor: pink;\n}")
  tr.ok("a::before {\ncontent: \";a\";\n}")
  tr.ok("a {\ncolor: pink;\n top:0;\n}")
  tr.ok("a {\ncolor: pink;\n  top:0;\n}")
  tr.ok("a {\ncolor: pink;\n\ttop:0;\n}")
  tr.ok("a {\ncolor: pink;\ntop: 0; }", "space between trailing semicolon and closing brace")
  tr.ok("a {\ncolor: pink;\ntop: 0;}", "no space between trailing semicolon and closing brace")

  // Ignore single-line
  tr.ok("a { color: pink; top: 0; }")
  tr.ok("a { color: pink; /* 1 */ top: 0; }")
  tr.ok("a,\nb { color: pink; top: 0}", "multi-line rule, single-line declaration-block")

  tr.notOk("a {\ncolor: pink;top: 0;\n}", messages.expectedAfterMultiLine())
  tr.notOk("a {\ncolor: pink; top: 0;\n}", messages.expectedAfterMultiLine())
  tr.notOk("a {\ncolor: pink; top: 0;\n}", messages.expectedAfterMultiLine())
  tr.notOk("a {\ncolor: pink;\ttop: 0;\n}", messages.expectedAfterMultiLine())
})

testRule("never-multi-line", tr => {
  warningFreeBasics(tr)

  tr.ok("a {\ncolor: pink;\n}")
  tr.ok("a::before {\ncontent: \";\na\";\n}")
  tr.ok("a {\ncolor: pink;top: 0; }", "space between trailing semicolon and closing brace")
  tr.ok("a {\ncolor: pink;top: 0;}", "no space between trailing semicolon and closing brace")

  // Ignore single-line
  tr.ok("a { color: pink; top: 0; }")
  tr.ok("a,\nb { color: pink; top: 0}", "multi-line rule, single-line declaration-block")

  tr.notOk("a {\ncolor: pink; top: 0;\n}", messages.rejectedAfterMultiLine())
  tr.notOk("a {\ncolor: pink;  top: 0;\n}", messages.rejectedAfterMultiLine())
  tr.notOk("a {\ncolor: pink;\ntop: 0;\n}", messages.rejectedAfterMultiLine())
  tr.notOk("a {\ncolor: pink;\ttop: 0;\n}", messages.rejectedAfterMultiLine())
})

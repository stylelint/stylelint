import { ruleTester } from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

testRule("always", tr => {
  tr.ok("a { color: pink;\n}")
  tr.ok("a { color: pink;\n\t\t}")
  tr.ok("a { color: pink;\n} b { color: red;\n}")
  tr.ok("a { color: pink;\n}b { color: red;\n}")

  tr.notOk("a { color: pink;}", messages.expectedBefore())
  tr.notOk("a { color: pink; }", messages.expectedBefore())
  tr.notOk("a { color: pink; \n}", messages.expectedBefore())
  tr.notOk("a { color: pink;  }", messages.expectedBefore())
  tr.notOk("a { color: pink;\t}", messages.expectedBefore())
  tr.notOk("a { color: pink;\n} b { color: red; }", messages.expectedBefore())
})

testRule("never", tr => {
  tr.ok("a { color: pink;}")
  tr.ok("a { color: pink;} b { color: red;}")
  tr.ok("a { color: pink;}b { color: red;}")

  tr.notOk("a { color: pink; }", messages.rejectedBefore())
  tr.notOk("a { color: pink;\n}", messages.rejectedBefore())
  tr.notOk("a { color: pink;  }", messages.rejectedBefore())
  tr.notOk("a { color: pink;\t}", messages.rejectedBefore())
  tr.notOk("a { color: pink;} b { color: red;\n}", messages.rejectedBefore())
})

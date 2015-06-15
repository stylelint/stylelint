import { ruleTester } from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

testRule("always", tr => {
  tr.ok("/* comment */")
  tr.ok("/* comment comment */")
  tr.ok("/* comment\ncomment */")
  tr.ok("/* comment\n\ncomment */")

  tr.notOk("/*comment */", messages.expectedOpening)
  tr.notOk("/* comment*/", messages.expectedClosing)
  tr.notOk("/*  comment */", messages.expectedOpening)
  tr.notOk("/* comment  */", messages.expectedClosing)
  tr.notOk("/*comment comment */", messages.expectedOpening)
  tr.notOk("/* comment comment*/", messages.expectedClosing)
  tr.notOk("/*comment\n\ncomment */", messages.expectedOpening)
  tr.notOk("/* comment\n\ncomment*/", messages.expectedClosing)
})

testRule("never", tr => {
  tr.ok("/*comment*/")
  tr.ok("/*comment comment*/")
  tr.ok("/*comment\ncomment*/")
  tr.ok("/*comment\n\ncomment*/")

  tr.notOk("/* comment*/", messages.rejectedOpening)
  tr.notOk("/*comment */", messages.rejectedClosing)
  tr.notOk("/*  comment*/", messages.rejectedOpening)
  tr.notOk("/*comment  */", messages.rejectedClosing)
  tr.notOk("/* comment comment*/", messages.rejectedOpening)
  tr.notOk("/*comment comment */", messages.rejectedClosing)
  tr.notOk("/* comment\n\ncomment*/", messages.rejectedOpening)
  tr.notOk("/*comment\n\ncomment */", messages.rejectedClosing)
})

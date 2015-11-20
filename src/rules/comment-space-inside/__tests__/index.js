import {
  ruleTester,
  warningFreeBasics,
} from "../../../testUtils"
import rule, { ruleName, messages } from ".."
import scss from "postcss-scss"

const testRule = ruleTester(rule, ruleName)

testRule("always", tr => {
  warningFreeBasics(tr)

  tr.ok("/* comment */")
  tr.ok("/* comment comment */")
  tr.ok("/* comment\ncomment */")
  tr.ok("/* comment\n\ncomment */")
  tr.ok("/** comment */")
  tr.ok("/**** comment ***/")
  tr.ok("/*\ncomment\n*/")
  tr.ok("/*\tcomment   */")
  tr.ok("//comment", "line comment ignored", { syntax: scss })

  tr.notOk("/*comment */", {
    message: messages.expectedOpening,
    line: 1,
    column: 3,
  })
  tr.notOk("/**comment **/", {
    message: messages.expectedOpening,
    line: 1,
    column: 4,
  })
  tr.notOk("/* comment*/", {
    message: messages.expectedClosing,
    line: 1,
    column: 10,
  })
  tr.notOk("/*comment comment */", {
    message: messages.expectedOpening,
    line: 1,
    column: 3,
  })
  tr.notOk("/* comment comment*/", {
    message: messages.expectedClosing,
    line: 1,
    column: 18,
  })
  tr.notOk("/*comment\n\ncomment */", {
    message: messages.expectedOpening,
    line: 1,
    column: 3,
  })
  tr.notOk("/* comment\n\ncomment*/", {
    message: messages.expectedClosing,
    line: 3,
    column: 7,
  })
})

testRule("never", tr => {
  warningFreeBasics(tr)

  tr.ok("/*comment*/")
  tr.ok("/*comment comment*/")
  tr.ok("/*comment\ncomment*/")
  tr.ok("/*comment\n\ncomment*/")
  tr.ok("/**comment*/")
  tr.ok("/****comment***/")
  tr.ok("// comment", "line comment ignored", { syntax: scss })

  tr.notOk("/* comment*/", {
    message: messages.rejectedOpening,
    line: 1,
    column: 3,
  })
  tr.notOk("/** comment*/", {
    message: messages.rejectedOpening,
    line: 1,
    column: 4,
  })
  tr.notOk("/*comment */", {
    message: messages.rejectedClosing,
    line: 1,
    column: 10,
  })
  tr.notOk("/*  comment*/", {
    message: messages.rejectedOpening,
    line: 1,
    column: 3,
  })
  tr.notOk("/*comment  */", {
    message: messages.rejectedClosing,
    line: 1,
    column: 11,
  })
  tr.notOk("/*\ncomment*/", {
    message: messages.rejectedOpening,
    line: 1,
    column: 3,
  })
  tr.notOk("/*comment\n*/", {
    message: messages.rejectedClosing,
    line: 1,
    column: 10,
  })
  tr.notOk("/* comment comment*/", {
    message: messages.rejectedOpening,
    line: 1,
    column: 3,
  })
  tr.notOk("/*comment comment */", {
    message: messages.rejectedClosing,
    line: 1,
    column: 18,
  })
  tr.notOk("/* comment\n\ncomment*/", {
    message: messages.rejectedOpening,
    line: 1,
    column: 3,
  })
  tr.notOk("/*comment\n\ncomment */", {
    message: messages.rejectedClosing,
    line: 3,
    column: 8,
  })
})

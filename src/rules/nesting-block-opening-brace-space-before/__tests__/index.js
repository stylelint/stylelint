import {
  ruleTester,
  warningFreeBasics,
} from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

testRule("always", tr => {
  warningFreeBasics(tr)

  tr.ok("a { color: pink; }")
  tr.ok("a { { &:hover { color: pink; }}}")
  tr.ok("a { { &:hover { &:before { color: pink; }}}}")

  tr.notOk("a {{ &:hover { color: pink; }}}", {
    message: messages.expectedBefore(),
    line: 1,
    column: 4,
  })
  tr.notOk("a {{ &:hover {\ncolor: pink; }}}", {
    message: messages.expectedBefore(),
    line: 1,
    column: 4,
  })
  tr.notOk("a {\t{ &:hover { color: pink; }}}", {
    message: messages.expectedBefore(),
    line: 1,
    column: 5,
  })
  tr.notOk("a { { &:hover {\n{ &:before { color: pink; }}}}}", {
    message: messages.expectedBefore(),
    line: 2,
    column: 1,
  })
  tr.notOk("a {\n{ &:hover { { &:before { color: pink; }}}}}", {
    message: messages.expectedBefore(),
    line: 2,
    column: 1,
  })
})

testRule("never", tr => {
  warningFreeBasics(tr)

  tr.ok("a { color: pink; }")
  tr.ok("a {{ &:hover { color: pink; }}}")
  tr.ok("a {{ &:hover { &:before { color: pink; }}}}")

  tr.notOk("a { { &:hover { color: pink; }}}", {
    message: messages.rejectedBefore(),
    line: 1,
    column: 5,
  })
  tr.notOk("a {  { &:hover {\ncolor: pink; }}}", {
    message: messages.rejectedBefore(),
    line: 1,
    column: 6,
  })
  tr.notOk("a {\t{ &:hover { color: pink; }}}", {
    message: messages.rejectedBefore(),
    line: 1,
    column: 5,
  })
  tr.notOk("a {\r\n{ &:hover {{ &:before { color: pink; }}}}}", {
    message: messages.rejectedBefore(),
    line: 2,
    column: 1,
  })
  tr.notOk("a {{ &:hover {\n{ &:before { color: pink; }}}}}", {
    message: messages.rejectedBefore(),
    line: 2,
    column: 1,
  })
})

testRule("always-single-line", tr => {
  warningFreeBasics(tr)

  tr.ok("a { color: pink; }")
  tr.ok("a { { &:hover { color: pink; }}}")
  tr.ok("a { { &:hover { color: pink; }}}", "CRLF")
  tr.ok("a { { &:hover { &:before { color: pink; }}}}")

  tr.ok("a {{ &:hover\n{ color: pink;\n}}}", "multi-line")
  tr.ok("a {{ &:hover \n{ { &:before { color: pink; }}}}}", "multi-line")

  tr.notOk("a {{ &:hover { color: pink; }}}", {
    message: messages.expectedBeforeSingleLine(),
    line: 1,
    column: 4,
  })
  tr.notOk("a {\t{ &:hover { color: pink; }}}", {
    message: messages.expectedBeforeSingleLine(),
    line: 1,
    column: 5,
  })
  tr.notOk("a {\n{ &:hover { { &:before { color: pink; }}}}}", {
    message: messages.expectedBeforeSingleLine(),
    line: 2,
    column: 1,
  })
  tr.notOk("a { { &:hover {\n{ &:before { color: pink; }}}}}", {
    message: messages.expectedBeforeSingleLine(),
    line: 2,
    column: 1,
  })
})

testRule("never-single-line", tr => {
  warningFreeBasics(tr)

  tr.ok("a {{ &:hover { color: pink; }}}")
  tr.ok("a {{ &:hover { color: pink; }}}", "CRLF")
  tr.ok("a {{ &:hover {{ &:before { color: pink; }}}}}")

  tr.ok("a { { &:hover\n{ color: pink; }}}", "multi-line")

  tr.notOk("a { { &:hover { color: pink; }}}", {
    message: messages.rejectedBeforeSingleLine(),
    line: 1,
    column: 5,
  })
  tr.notOk("a {\n{ &:hover { color: pink; }}}", {
    message: messages.rejectedBeforeSingleLine(),
    line: 2,
    column: 1,
  })
  tr.notOk("a {\r\n{ &:hover { color: pink; }}}", {
    message: messages.rejectedBeforeSingleLine(),
    line: 2,
    column: 1,
  })
  tr.notOk("a {\n\t{ &:hover {{ &:before { color: pink; }}}}}", {
    message: messages.rejectedBeforeSingleLine(),
    line: 2,
    column: 2,
  })
})

testRule("always-multi-line", tr => {
  warningFreeBasics(tr)

  tr.ok("a {\ncolor: pink; }")
  tr.ok("a { { &:hover\n{ color: pink; }}}")
  tr.ok("a { { &:hover\r\n{ color: pink; }}}", "CRLF")
  tr.ok("a { { &:hover { &:before\n{ color: pink; }}}}")

  tr.ok("a {{ &:hover { color: pink; }}}", "single-line")
  tr.ok("a {{ &:hover {\t\t\t{ &:before { color: pink; }}}}}", "single-line")

  tr.notOk("a {{ &:hover\n{ color: pink; }}}", {
    message: messages.expectedBeforeMultiLine(),
    line: 1,
    column: 4,
  })
  tr.notOk("a {\t{ &:hover\n{ color: pink; }}}", {
    message: messages.expectedBeforeMultiLine(),
    line: 1,
    column: 5,
  })
  tr.notOk("a { { &:hover {{ &:before\r\n{ color: pink; }}}}}", {
    message: messages.expectedBeforeMultiLine(),
    line: 1,
    column: 16,
  })
})

testRule("never-multi-line", tr => {
  warningFreeBasics(tr)

  tr.ok("a {{ &:hover\n{ color: pink; }}}")
  tr.ok("a {{ &:hover\n{ color: pink; }}}", "CRLF")
  tr.ok("a {{ &:hover\n{{ &:before\n{ color: pink; }}}}}")

  tr.ok("a { { &:hover { color: pink; }}}", "single-line")
  tr.ok("a {\t\t{ &:hover { color: pink; }}}", "single-line")

  tr.notOk("a { { &:hover\n{ color: pink; }}}", {
    message: messages.rejectedBeforeMultiLine(),
    line: 1,
    column: 5,
  })
  tr.notOk("a {\t{ &:hover\r\n{ color: pink; }}}", {
    message: messages.rejectedBeforeMultiLine(),
    line: 1,
    column: 5,
  })
  tr.notOk("a { { &:hover {{ &:before\n{ color: pink; }}}}}", {
    message: messages.rejectedBeforeMultiLine(),
    line: 1,
    column: 5,
  })
})

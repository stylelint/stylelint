import {
  ruleTester,
  warningFreeBasics
} from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

testRule("always", tr => {
  warningFreeBasics(tr)

  tr.ok("a { color: pink; }")
  tr.ok("a {\n{ &:hover { color: pink; }}}")
  tr.ok("a {\r\n{ &:hover { color: pink; }}}", "CRLF")
  tr.ok("a {\r\n{ &:hover {\ncolor: pink; }}}", "CRLF")
  tr.ok("a {\n\t{ &:hover\n\t\t{ &:before { color: pink; }}}}")

  tr.notOk("a {{ &:hover { color: pink; }}}", messages.expectedBefore())
  tr.notOk("a {{ &:hover {\ncolor: pink; }}}", messages.expectedBefore())
  tr.notOk("a {\t{ &:hover { color: pink; }}}", messages.expectedBefore())
  tr.notOk("a {\t{ &:hover {\n\t\t{ &:before { color: pink; }}}}}", messages.expectedBefore())
  tr.notOk("a {\n\t{ &:hover {\t\t{ &:before { color: pink; }}}}}", messages.expectedBefore())
})

testRule("always-single-line", tr => {
  warningFreeBasics(tr)

  tr.ok("a { color: pink; }")
  tr.ok("a {\n{ &:hover { color: pink; }}}")
  tr.ok("a {\r\n{ &:hover { color: pink; }}}", "CRLF")
  tr.ok("a {\n\t{ &:hover\n\t\t{ &:before { color: pink; }}}}")

  tr.ok("a {{ &:hover\n{ color: pink;\n}}}", "multi-line")
  tr.ok("a {\t{ &:hover {\n\t\t{ &:before { color: pink; }}}}}", "multi-line")

  tr.notOk("a {{ &:hover { color: pink; }}}", messages.expectedBeforeSingleLine())
  tr.notOk("a {\t{ &:hover { color: pink; }}}", messages.expectedBeforeSingleLine())
  tr.notOk("a {\n\t{ &:hover {\t\t{ &:before { color: pink; }}}}}", messages.expectedBeforeSingleLine())
})

testRule("never-single-line", tr => {
  warningFreeBasics(tr)

  tr.ok("a {{ &:hover { color: pink; }}}")
  tr.ok("a {{ &:hover { color: pink; }}}", "CRLF")
  tr.ok("a {{ &:hover {{ &:before { color: pink; }}}}}")

  tr.ok("a {\n{ &:hover\n{ color: pink; }}}", "multi-line")

  tr.notOk("a {\n{ &:hover { color: pink; }}}", messages.rejectedBeforeSingleLine())
  tr.notOk("a {\r\n{ &:hover { color: pink; }}}", messages.rejectedBeforeSingleLine())
  tr.notOk("a {\n\t{ &:hover {{ &:before { color: pink; }}}}}", messages.rejectedBeforeSingleLine())
})

testRule("always-multi-line", tr => {
  warningFreeBasics(tr)

  tr.ok("a {\ncolor: pink; }")
  tr.ok("a {\n{ &:hover\n{ color: pink; }}}")
  tr.ok("a {\r\n{ &:hover\n{ color: pink; }}}", "CRLF")
  tr.ok("a {\n\t{ &:hover\n\t\t{ &:before\n{ color: pink; }}}}")

  tr.ok("a {{ &:hover { color: pink; }}}", "single-line")
  tr.ok("a {\t{ &:hover {\t\t{ &:before { color: pink; }}}}}", "single-line")

  tr.notOk("a {{ &:hover\n{ color: pink; }}}", messages.expectedBeforeMultiLine())
  tr.notOk("a {\t{ &:hover\n{ color: pink; }}}", messages.expectedBeforeMultiLine())
  tr.notOk("a {\n\t{ &:hover {\t\t{ &:before\n{ color: pink; }}}}}", messages.expectedBeforeMultiLine())
})

testRule("never-multi-line", tr => {
  warningFreeBasics(tr)

  tr.ok("a {{ &:hover\n{ color: pink; }}}")
  tr.ok("a {{ &:hover\n{ color: pink; }}}", "CRLF")
  tr.ok("a {{ &:hover\n{{ &:before\n{ color: pink; }}}}}")

  tr.ok("a {\n{ &:hover { color: pink; }}}", "single-line")

  tr.notOk("a {\n{ &:hover\n{ color: pink; }}}", messages.rejectedBeforeMultiLine())
  tr.notOk("a {\r\n{ &:hover\r\n{ color: pink; }}}", messages.rejectedBeforeMultiLine())
  tr.notOk("a {\n\t{ &:hover {{ &:before\n{ color: pink; }}}}}", messages.rejectedBeforeMultiLine())
})

import test from "tape"
import isSingleLineString from "../isSingleLineString"

const multiLineTemplate = (
`foo
bar`
)

test("isSingleLineString", t => {
  t.ok(isSingleLineString("foo"))
  t.ok(isSingleLineString("foo bar"))
  t.ok(isSingleLineString("\nfoo bar"), "ignores opening newline")
  t.ok(isSingleLineString("foo bar\n"), "ignores closing newline")
  t.notOk(isSingleLineString("foo\nbar"))
  t.notOk(isSingleLineString("foo\rbar"))
  t.notOk(isSingleLineString(multiLineTemplate))
  t.end()
})

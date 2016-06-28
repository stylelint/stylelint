import isSingleLineString from "../isSingleLineString"
import test from "tape"

const multiLineTemplate = (
`foo
bar`
)

test("isSingleLineString", t => {
  t.ok(isSingleLineString("foo"))
  t.ok(isSingleLineString("foo bar"))
  t.notOk(isSingleLineString("foo\nbar"))
  t.notOk(isSingleLineString("foo\rbar"))
  t.notOk(isSingleLineString(multiLineTemplate))
  t.end()
})

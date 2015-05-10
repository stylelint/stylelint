import test from "tape"
import isSingleLineString from "../isSingleLineString"

const multiLineTemplate = (
`foo
bar`
)

test("isSingleLineString", t => {
  t.ok(isSingleLineString("foo"))
  t.ok(isSingleLineString("foo bar"))
  t.notOk(isSingleLineString("foo\n"))
  t.notOk(isSingleLineString("foo\rbar"))
  t.notOk(isSingleLineString(multiLineTemplate))
  t.end()
})

import blurComments from "../blurComments"
import test from "tape"

test("blurComments", t => {
  t.equal(blurComments("abc"), "abc")
  t.equal(blurComments("/* abc */"), "`")
  t.equal(blurComments("a { b:c } /*abc*/", "#"), "a { b:c } #")
  t.end()
})

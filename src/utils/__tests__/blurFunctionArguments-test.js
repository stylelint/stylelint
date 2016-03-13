import test from "tape"
import blurFunctionArguments from "../blurFunctionArguments"

test("blurFunctionArguments", t => {
  t.equal(blurFunctionArguments("abc abc", "url"), "abc abc")
  t.equal(blurFunctionArguments("abc url(abc) abc", "url"), "abc url(```) abc")
  t.equal(blurFunctionArguments("abc url(abc) url(xx)", "url", "#"), "abc url(###) url(##)")
  t.end()
})

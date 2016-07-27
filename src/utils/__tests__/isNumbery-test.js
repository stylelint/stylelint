import isNumbery from "../isNumbery"
import test from "tape"

test("isNumbery", t => {
  t.ok(isNumbery("1"))
  t.ok(isNumbery("21 "))
  t.ok(isNumbery(" 212"))
  t.ok(isNumbery("232 "))
  t.notOk(isNumbery(""))
  t.notOk(isNumbery(" "))
  t.notOk(isNumbery("a"))
  t.end()
})

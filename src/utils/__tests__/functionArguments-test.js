import test from "tape"
import functionArguments from "../functionArguments"

test("passes function arguments to callback", t => {
  functionArguments("calc(1 + 3)", "calc", args => {
    t.equal(args, "1 + 3")
  })
  t.end()
})

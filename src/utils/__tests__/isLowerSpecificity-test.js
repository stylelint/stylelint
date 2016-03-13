import isLowerSpecificity from "../isLowerSpecificity"
import test from "tape"

test("isLowerSpecificity", t => {
  t.ok(isLowerSpecificity("0,0,0,1", "0,0,0,2"))
  t.notOk(isLowerSpecificity("0,0,1,0", "0,0,0,2"))

  t.ok(isLowerSpecificity([ 0, 0, 999, 999 ], [ 0, 1, 0, 0 ]))
  t.ok(isLowerSpecificity([ 0, 999, 999, 999 ], [ 0, 1000, 0, 0 ]))

  t.end()
})

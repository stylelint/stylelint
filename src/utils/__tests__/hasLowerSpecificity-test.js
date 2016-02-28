import hasLowerSpecificity from "../hasLowerSpecificity"
import test from "tape"

test("hasLowerSpecificity", t => {
  t.ok(hasLowerSpecificity("0,0,0,1", "0,0,0,2"))
  t.notOk(hasLowerSpecificity("0,0,1,0", "0,0,0,2"))

  t.ok(hasLowerSpecificity([ 0, 0, 999, 999 ], [ 0, 1, 0, 0 ]))
  t.ok(hasLowerSpecificity([ 0, 999, 999, 999 ], [ 0, 1000, 0, 0 ]))

  t.end()
})

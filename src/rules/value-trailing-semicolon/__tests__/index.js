import test from "tape"
import testRule from "../../__tests__/utils/testRule"

import valueTrailingSemicolon from ".."

const testValueTrailingSemicolon = testRule(valueTrailingSemicolon)

test("value-trailing-semicolon success", t => {
  t.plan(2)

  testValueTrailingSemicolon(
    "body { background: pink; }",
    warnings => {
      t.equal(
        warnings.length,
        0,
        "should not add warning if semi-colon is present with lone declaration"
      )
    }
  )

  testValueTrailingSemicolon(
    "body { color: orange; background: pink; }",
    warnings => {
      t.equal(
        warnings.length,
        0,
        "should not add warnings if semi-colon is present with multiple declarations"
      )
    }
  )
})

test("value-trailing-semicolon failure", t => {
  t.plan(4)

  testValueTrailingSemicolon(
    "body { background: pink }",
    warnings => {
      t.equal(
        warnings.length,
        1,
        "lone declaration"
      )

      t.equal(
        warnings[0].text,
        "Expected a trailing semicolon (value-trailing-semicolon)",
        "should add a warning if semi-colon is missing "
      )
    }
  )

  testValueTrailingSemicolon(
    "body { color: orange; background: pink }",
    warnings => {
      t.equal(
        warnings.length,
        1,
        "should add warnings if semi-colon are missing"
      )

      t.equal(
        warnings[0].text,
        "Expected a trailing semicolon (value-trailing-semicolon)",
        "should provide a clear message"
      )
    }
  )
})

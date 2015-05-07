import test from "tape"
import testRule from "../../__tests__/utils/testRule"

import trailingSemicolon from ".."

const testTrailingSemicolon = testRule(trailingSemicolon)
const expectedError = "Expected a trailing semicolon (declaration-block-trailing-semicolon)"
const rejectedError = "Expected no trailing semicolon (declaration-block-trailing-semicolon)"

test("declaration-block-trailing-semicolon success", t => {
  t.test("with `true` setting", st => {
    st.plan(2)

    testTrailingSemicolon(
      "body { background: pink; }",
      true,
      warnings => {
        st.equal(
          warnings.length,
          0,
          "should not add warning if semicolon is present with lone declaration"
        )
      }
    )

    testTrailingSemicolon(
      "body { color: orange; background: pink; }",
      true,
      warnings => {
        st.equal(
          warnings.length,
          0,
          "should not add warnings if semicolon is present with multiple declarations"
        )
      }
    )
  })

  t.test("with `false` setting", st => {
    st.plan(2)

    testTrailingSemicolon(
      "body { background: pink }",
      false,
      warnings => {
        st.equal(
          warnings.length,
          0,
          "should not add warning if semicolon is absent with lone declaration"
        )
      }
    )

    testTrailingSemicolon(
      "body { color: orange; background: pink }",
      false,
      warnings => {
        st.equal(
          warnings.length,
          0,
          "should not add warnings if semicolon is absent with multiple declarations"
        )
      }
    )
  })

  t.end()
})

test("declaration-block-trailing-semicolon failure", t => {

  t.test("with `true` setting", st => {
    st.plan(4)

    testTrailingSemicolon(
      "body { background: pink }",
      true,
      warnings => {
        st.equal(
          warnings.length,
          1,
          "should warn if semicolon is absent with lone declaration"
        )

        st.equal(
          warnings[0].text,
          expectedError,
          "warning contains expected text"
        )
      }
    )

    testTrailingSemicolon(
      "body { color: orange; background: pink }",
      true,
      warnings => {
        st.equal(
          warnings.length,
          1,
          "should warn if semicolon is absent with multiple declarations"
        )

        st.equal(
          warnings[0].text,
          expectedError,
          "warning contains expected text"
        )
      }
    )
  })

  t.test("with `false` setting", st => {
    st.plan(4)

    testTrailingSemicolon(
      "body { background: pink; }",
      false,
      warnings => {
        st.equal(
          warnings.length,
          1,
          "should warn if semicolon is present with lone declaration"
        )

        st.equal(
          warnings[0].text,
          rejectedError,
          "warning contains expected text"
        )
      }
    )

    testTrailingSemicolon(
      "body { color: orange; background: pink; }",
      false,
      warnings => {
        st.equal(
          warnings.length,
          1,
          "should warn if semicolon is present with lone declaration"
        )

        st.equal(
          warnings[0].text,
          rejectedError,
          "warning contains expected text"
        )
      }
    )
  })

  t.end()
})

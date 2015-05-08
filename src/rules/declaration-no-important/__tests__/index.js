import test from "tape"
import testRule from "../../../testUtils/testRule"

import noImportant, { messages } from ".."

const testNoImportant = testRule(noImportant)

test("declaration-no-important success", t => {
  t.test("with `true` setting", st => {
    st.plan(1)

    testNoImportant(
      "body { background: pink; }",
      true,
      warnings => {
        st.equal(
          warnings.length,
          0,
          "should not add warning if !important is not present"
        )
      }
    )
  })

  t.test("with `false` setting", st => {
    st.plan(2)

    testNoImportant(
      "body { background: pink; }",
      false,
      warnings => {
        st.equal(
          warnings.length,
          0,
          "should not add warning if !important is not present"
        )
      }
    )

    testNoImportant(
      "body { color: orange !important; }",
      false,
      warnings => {
        st.equal(
          warnings.length,
          0,
          "should not add warning if !important is present"
        )
      }
    )
  })

  t.end()
})

test("declaration-no-important failure", t => {

  t.test("with `true` setting", st => {
    st.plan(2)

    testNoImportant(
      "body { background: pink !important; }",
      true,
      warnings => {
        st.equal(
          warnings.length,
          1,
          "should add warning if !important is present"
        )

        st.equal(
          warnings[0].text,
          messages.unexpected,
          "warning contains expected text"
        )
      }
    )
  })

  t.end()
})

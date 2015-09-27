import {
  ruleTester,
  warningFreeBasics,
} from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

testRule(undefined, tr => {
  warningFreeBasics(tr)

  // Keywords

  tr.ok(".foo { background: linear-gradient(to top, #fff, #000; )}")
  tr.ok(".foo { background: linear-gradient(to bottom, #fff, #000; )}")
  tr.ok(".foo { background: linear-gradient(  to right, #fff, #000; )}")
  tr.ok(".foo { background: linear-gradient(to left  , #fff, #000; )}")
  tr.ok(".foo { background: linear-gradient( to top left, #fff, #000; )}")
  tr.ok(".foo { background: linear-gradient(\n\tto left top, \n\t#fff, #000; )}")
  tr.ok(".foo { background: linear-gradient(to bottom right, #fff, #000; )}")
  tr.ok(".foo { background: linear-gradient(to right bottom, #fff, #000; )}")

  tr.notOk(".foo { background: linear-gradient(bottom, #fff, #000; )}", messages.rejected)
  tr.notOk(".foo { background: linear-gradient(top, #fff, #000; )}", messages.rejected)
  tr.notOk(".foo { background: linear-gradient(left, #fff, #000; )}", messages.rejected)
  tr.notOk(".foo { background: linear-gradient(right, #fff, #000; )}", messages.rejected)
  tr.notOk(".foo { background: linear-gradient(to top top, #fff, #000; )}", messages.rejected)

  // Angles

  tr.ok(".foo { background: linear-gradient(45deg, #fff, #000); }")
  tr.ok(".foo { background: linear-gradient(100grad, #fff, #000); }")
  tr.ok(".foo { background: linear-gradient(0.25turn, #fff, #000); }")
  tr.ok(".foo { background: linear-gradient(1.57rad, #fff, #000); }")

  tr.notOk(".foo { background: linear-gradient(45, #fff, #000; )}", messages.rejected)
  tr.notOk(".foo { background: linear-gradient(0.25, #fff, #000; )}", messages.rejected)
  tr.notOk(".foo { background: linear-gradient(1.577, #fff, #000; )}", messages.rejected)

  // No direction argument

  tr.ok(".foo { background: linear-gradient(#fff, #000); }")
  tr.ok(".foo { background: linear-gradient(black, white); }")
  tr.ok(".foo { background: linear-gradient(rgba(255, 255, 255, 0.5) 0%, #000); }")
})

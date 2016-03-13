import test from "tape"
import postcss from "postcss"
import findMediaContext from "../findMediaContext"

test("findMediaContext", t => {
  const css = `
    a {}
    @media print {
      b {}
    }
    @media (min-width: 900px) {
      c {}
    }
    d {}
  `

  t.plan(4)
  postcss().process(css).then(result => {
    result.root.eachRule(rule => {
      switch (rule.selector) {
        case "a":
          t.equal(findMediaContext(rule), null)
          break
        case "b":
          t.equal(findMediaContext(rule).params, "print")
          break
        case "c":
          t.equal(findMediaContext(rule).params, "(min-width: 900px)")
          break
        case "d":
          t.equal(findMediaContext(rule), null)
          break
        default:
      }
    })
  })
})

import cssRuleIsKeyframe from "../cssRuleIsKeyframe"
import postcss from "postcss"
import test from "tape"

test("cssRuleIsKeyframe", t => {
  postcssOkCheck(t, "@keyframes identifier { to {} }", "to")
  postcssOkCheck(t, "@keyframes identifier { from {} }", "from")
  postcssOkCheck(t, "@keyframes identifier { 50% {} }", "percentage")

  postcssNotOkCheck(t, "a {}", "rule")
  postcssNotOkCheck(t, "a { & b {} }", "direct nested rule")
  postcssNotOkCheck(t, "a { @nest b & {} }", "@nest nested rule")
  postcssNotOkCheck(t, "@media print { a {} }", "@media")
  postcssNotOkCheck(t, "@supports (animation-name: test) { a {} }", "@supports")
  postcssNotOkCheck(t, "@document url(http://www.w3.org/) { a {} }", "@document")
  postcssNotOkCheck(t, "@page :pseudo-class { a {} }", "page")
  postcssNotOkCheck(t, "@font-face { src: url(x.woff) }", "font-face")

  t.end()
})

function postcssOkCheck(t, css, desc) {
  postcss().process(css).then(result => {
    result.root.walkRules(rule => {
      t.ok(cssRuleIsKeyframe(rule), desc)
    })
  })
}

function postcssNotOkCheck(t, css, desc) {
  postcss().process(css).then(result => {
    result.root.walkRules(rule => {
      t.notOk(cssRuleIsKeyframe(rule), desc)
    })
  })
}

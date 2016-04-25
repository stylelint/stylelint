import isStandardTypeSelector from "../isStandardTypeSelector"
import postcss from "postcss"
import test from "tape"
import selectorParser from "postcss-selector-parser"

test("isStandardTypeSelector", t => {
  t.plan(3)

  rules("a {}", func => {
    t.ok(isStandardTypeSelector(func), "tag")
  })

  rules(".foo:nth-child(n) {}", func => {
    t.notOk(isStandardTypeSelector(func), "pseudo selector")
  })

  rules(".foo { & {} }", func => {
    t.notOk(isStandardTypeSelector(func), "nesting selector")
  })
})

function rules(css, cb) {
  postcss().process(css).then(result => {
    result.root.walkRules(rule => {
      selectorParser(selectorAST => {
        selectorAST.eachTag(tag => {
          cb(tag)
        })
      }).process(rule.selector)
    })
  })
}

import isStandardTypeSelector from "../isStandardTypeSelector"
import postcss from "postcss"
import test from "tape"
import selectorParser from "postcss-selector-parser"

test("isStandardTypeSelector", t => {
  t.plan(8)

  rules("a {}", func => {
    t.ok(isStandardTypeSelector(func), "tag")
  })

  rules(".foo:nth-child(n) {}", func => {
    t.notOk(isStandardTypeSelector(func), "nth-child pseudo selector")
  })

  rules(".foo:nth-last-child(n) {}", func => {
    t.notOk(isStandardTypeSelector(func), "nth-last-child pseudo selector")
  })

  rules(".foo:nth-of-type(n) {}", func => {
    t.notOk(isStandardTypeSelector(func), "nth-of-type pseudo selector")
  })

  rules(":lang(en) {}", func => {
    t.notOk(isStandardTypeSelector(func), "lang pseudo selector")
  })

  rules(":dir(ltr) {}", func => {
    t.notOk(isStandardTypeSelector(func), "dir pseudo selector")
  })

  rules(".foo { &-bar {} }", func => {
    t.notOk(isStandardTypeSelector(func), "nesting selector")
  })

  rules(".foo { &__bar {} }", func => {
    t.notOk(isStandardTypeSelector(func), "nesting selector")
  })
})

function rules(css, cb) {
  postcss().process(css).then(result => {
    result.root.walkRules(rule => {
      selectorParser(selectorAST => {
        selectorAST.walkTags(tag => {
          cb(tag)
        })
      }).process(rule.selector)
    })
  }).catch(error => {
    console.log(error) // eslint-disable-line no-console
  })
}

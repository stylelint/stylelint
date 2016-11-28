"use strict"

const isStandardSyntaxTypeSelector = require("../isStandardSyntaxTypeSelector")
const postcss = require("postcss")
const selectorParser = require("postcss-selector-parser")
const test = require("tape")

test("isStandardSyntaxTypeSelector", t => {
  t.plan(8)

  rules("a {}", func => {
    t.ok(isStandardSyntaxTypeSelector(func), "tag")
  })

  rules(".foo:nth-child(n) {}", func => {
    t.notOk(isStandardSyntaxTypeSelector(func), "nth-child pseudo selector")
  })

  rules(".foo:nth-last-child(n) {}", func => {
    t.notOk(isStandardSyntaxTypeSelector(func), "nth-last-child pseudo selector")
  })

  rules(".foo:nth-of-type(n) {}", func => {
    t.notOk(isStandardSyntaxTypeSelector(func), "nth-of-type pseudo selector")
  })

  rules(":lang(en) {}", func => {
    t.notOk(isStandardSyntaxTypeSelector(func), "lang pseudo selector")
  })

  rules(":dir(ltr) {}", func => {
    t.notOk(isStandardSyntaxTypeSelector(func), "dir pseudo selector")
  })

  rules(".foo { &-bar {} }", func => {
    t.notOk(isStandardSyntaxTypeSelector(func), "nesting selector")
  })

  rules(".foo { &__bar {} }", func => {
    t.notOk(isStandardSyntaxTypeSelector(func), "nesting selector")
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

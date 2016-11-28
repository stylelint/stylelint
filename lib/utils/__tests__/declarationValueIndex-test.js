"use strict"

const declarationValueIndex = require("../declarationValueIndex")
const postcss = require("postcss")
const test = require("tape")

test("declarationValueIndex", t => {
  t.plan(5)

  rules("a { a: b }", decl => {
    t.equal(declarationValueIndex(decl), 3)
  })
  rules("a { a :b }", decl => {
    t.equal(declarationValueIndex(decl), 3)
  })
  rules("a { a:b }", decl => {
    t.equal(declarationValueIndex(decl), 2)
  })
  rules("a { a  : b }", decl => {
    t.equal(declarationValueIndex(decl), 5)
  })
  rules("a { a:\nb }", decl => {
    t.equal(declarationValueIndex(decl), 3)
  })
})

function rules(css, cb) {
  postcss().process(css).then(result => {
    result.root.walkDecls(cb)
  })
}

"use strict"

const isStandardSyntaxFunction = require("../isStandardSyntaxFunction")
const postcss = require("postcss")
const test = require("tape")
const valueParser = require("postcss-value-parser")

test("isStandardSyntaxFunction", t => {
  t.plan(4)

  rules("a { prop: calc(a + b) }", func => {
    t.ok(isStandardSyntaxFunction(func), "calc")
  })

  rules("a { prop: url('x.css') }", func => {
    t.ok(isStandardSyntaxFunction(func), "url")
  })

  rules("a { $list: (list) }", func => {
    t.notOk(isStandardSyntaxFunction(func), "scss list")
  })

  rules("a { $map: (key: value) }", func => {
    t.notOk(isStandardSyntaxFunction(func), "scss map")
  })
})

function rules(css, cb) {
  postcss().process(css).then(result => {
    result.root.walkDecls(decl => {
      valueParser(decl.value).walk(valueNode => {
        if (valueNode.type !== "function") {
          return
        }
        cb(valueNode)
      })
    })
  })
}
